# 1. Bucket for the built frontend (private, CloudFront-only)
resource "aws_s3_bucket" "frontend" {
  bucket_prefix = "airtrack-frontend" # bucket names are global; prefix avoids collisions
}

resource "aws_cloudfront_origin_access_control" "frontend" {
  name                              = "airtrack-frontend-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

data "aws_iam_policy_document" "frontend" {
  statement {
    sid    = "AllowCloudFrontServicePrincipalReadWrite"
    effect = "Allow"

    actions = [
      "s3:GetObject",
      "s3:PutObject",
    ]

    resources = [
      "${aws_s3_bucket.frontend.arn}/*",
    ]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.cdn.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.bucket
  policy = data.aws_iam_policy_document.frontend.json
}

# AWS managed policies
data "aws_cloudfront_cache_policy" "optimized" { name = "Managed-CachingOptimized" }
data "aws_cloudfront_cache_policy" "disabled" { name = "Managed-CachingDisabled" }
data "aws_cloudfront_origin_request_policy" "all_viewer" { name = "Managed-AllViewerExceptHostHeader" }

resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  default_root_object = "index.html"

  origin {
    origin_id                = "s3"
    domain_name              = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend.id
  }

  origin {
    origin_id   = "alb"
    domain_name = aws_lb.alb.dns_name
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only" # ALB listens on 80 only
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # 2. everything else -> S3 (cached)
  default_cache_behavior {
    target_origin_id       = "s3"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    cache_policy_id        = data.aws_cloudfront_cache_policy.optimized.id
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  # 3. /api/* -> ALB (no cache, forwards cookies/query/headers, all methods)
  ordered_cache_behavior {
    path_pattern             = "/api/*"
    target_origin_id         = "alb"
    allowed_methods          = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods           = ["GET", "HEAD"]
    cache_policy_id          = data.aws_cloudfront_cache_policy.disabled.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer.id
    viewer_protocol_policy   = "redirect-to-https"
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    cloudfront_default_certificate = true # *.cloudfront.net until you add a domain
  }
}

output "cdn_url" { value = "https://${aws_cloudfront_distribution.cdn.domain_name}" }