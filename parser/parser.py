import re
from datetime import datetime, timedelta, timezone

def extract_uas_data(text):
    text = text.replace("\u00a0", " ")
    application_num = extract_application_num_from_pdf(text)
    permit_no = extract_permit_no_from_pdf(text)
    altitude = extract_height_from_pdf(text)
    if int(altitude) >= 501:
        class_num = 2
    else:
        class_num = 1
    
    activities = extract_activities_from_pdf(text)
    coordinates = extract_coordinates_from_pdf(text)
 
    return {
        "permitNo" : permit_no,
        "applicationNum" : application_num,
        "altitudeFt": altitude,
        "class" : class_num,
        "activities": activities,
        "coordinates": coordinates,
        "fullText": ""
    }



def extract_application_num_from_pdf(text):
    try:
        pattern = r"Application No\.\s*:\s*(CAAS/\S+)"
        application_num = re.search(pattern, text).group(1).strip()
        if not application_num:
            raise ValueError("Could not extract application number.")
        return application_num
    except:
        raise ValueError("Could not extract application number.")


def extract_permit_no_from_pdf(text):
    try:
        pattern = r"Permit No\.[^\S\n]*:[^\S\n]*(.*)"
        permit_no = re.search(pattern, text).group(1).strip()
        if not permit_no:
            raise ValueError("Could not extract permit number.")
        return permit_no
    except:
        raise ValueError("Could not extract permit number.")


def extract_height_from_pdf(text):
    try:
        pattern = r"(\d+)\s*ft"
        altitude = int(re.search(pattern, text).group(1).strip())
       
        if not altitude:
            raise ValueError("Could not extract height.")
        return altitude
    except:
        raise ValueError("Could not extract height.")

def extract_coordinates_from_pdf(text):
    try:
        pattern = (
            r"\b((\d{2})(\d{2})(\d{2}\.\d{2})[NS]"      # latitude:  DDMMSS.ss N/S
            r"[ \t]+"
            r"(\d{3})(\d{2})(\d{2}\.\d{2})[EW])"        # longitude: DDDMMSS.ss E/W
            r"\s*$"                                    # must be the last thing in the text
        )
        match = re.search(pattern, text)
        if not match:
            raise ValueError("Coordinates in incorrect format.")
        
        coords, lat_deg, lat_min, lat_sec, lon_deg, lon_min, lon_sec = match.groups()
        if int(lat_deg) > 90 or int(lon_deg) > 180:
            raise ValueError
        if int(lat_min) > 59 or int(lon_min) > 59 or float(lat_sec) >= 60 or float(lon_sec) >= 60:
            raise ValueError
        return coords
    except ValueError:
            raise 
    except:
        raise ValueError("Coordinates in incorrect format.")

def extract_activities_from_pdf(text):
    try:
        lines = text.splitlines()

        start_idx = None
        end_idx = None
        for i, line in enumerate(lines):
            if start_idx is None and re.search(
                r"Activity Date\s+Activity Time", line #Still extracting altitude?
            ):
                start_idx = i + 1
            elif start_idx is not None and re.match(r"Table 1\.", line.strip()):
                end_idx = i
                break

        if start_idx is None:
            raise ValueError("Could not locate table.")

        # Extracts date and time text from PDF, into one string
        # ['24 May 2026 0000LT to 2359LT', ...]
        table = " ".join(lines[start_idx:end_idx])

        date = r"\d{1,2}[\s-]+[A-Za-z]+[\s-]+\d{2,4}" 
        row_pattern = re.compile(
            rf"\b(?P<date>{date}(?:\s+to\s+{date})?)\s+"
            r"(?P<time>\d{4}LT\s+to\s+\d{4}LT)"
        )

        rows = []

        # rows = [{'activityDate': '24 May 2026', 'activityTime': '0000LT to 2359LT', 'activityDateTime': '2026-05-24T00:00:00+08:00'}, ...]
        for match in row_pattern.finditer(table):
            activity_date = " ".join(match["date"].split())   # collapse the joined line breaks
            activity_time = " ".join(match["time"].split())
            rows.append(
                {
                    "activityDate": activity_date,
                    "activityTime": activity_time,
                    "activityDateTime": convert_to_dtobj(activity_date, activity_time).isoformat(),
                }
            )
        
        if not rows:
            raise ValueError("Could not split activity into date and time.")

        return rows

    except ValueError:
        raise 

    except Exception as e:
        print(e)
        raise ValueError("Something went wrong in extracting activity date and time.")


def convert_to_dtobj(activity_date, activity_time):
    SGT = timezone(timedelta(hours=8)) 

  
    DATE_PATTERN = re.compile(r"(\d{1,2})[\s-]+([A-Za-z]{3})[A-Za-z]*[\s-]+(\d{4}|\d{2})")
    TIME_PATTERN = re.compile(r"(\d{2})(\d{2})\s*LT", re.IGNORECASE)

    date_match = DATE_PATTERN.search(activity_date)
    time_match = TIME_PATTERN.search(activity_time)

    if not date_match or not time_match:
        raise ValueError("Unable to convert activity date and time into Datetime object.")

    day, month, year = date_match.groups()
    year_format = "%Y" if len(year) == 4 else "%y"
    date = datetime.strptime(f"{day} {month} {year}", f"%d %b {year_format}")

    hour, minute = int(time_match[1]), int(time_match[2])
    return date.replace(hour=hour, minute=minute, tzinfo=SGT)  


# print(extract_uas_data("""
# Application No. : CAAS/AP1/2026/1760
# Permit No. : AP1/20260519/0001/UOP/0011
# Date : 18 May 2026
# Avetics Global Pte Ltd
# 47 Ayer Rajah Crescent, #07-08
# Singapore 139947
# ATTN: Mr Steven Leong
 
# Activity Date Activity Time Operating Altitude
# 24 May 2026 0000LT to 2359LT
# 1200 ft above mean sea level (AMSL)
# 27 May 2026 0000LT to 2359LT
# 30 May 2026 to 31 May 2026 0000LT to 2359LT
# 01 June 2026 0000LT to 2359LT
# 012345.67N 1035634.89E
#  """))

