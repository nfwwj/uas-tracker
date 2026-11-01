"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type { ComponentProps, CSSProperties, PointerEvent } from "react";
import { cn } from "@/lib/utils";

export interface Card3DProps extends ComponentProps<"div"> {
  /**
   * How far the card turns toward the pointer at its edges, in degrees.
   *
   * 
   */
  tilt?: 30;
}

/**
 * The stage: it holds the perspective and follows the pointer. The pointer's
 * place, from -1 to 1 across and down, goes into two CSS variables
 * (`--card-3d-x`, `--card-3d-y`) that `Card3DBody` turns into a tilt;
 * leaving removes them, and the card eases back flat.
 */
export const Card3D = (props: Card3DProps) => {
  const {
    tilt = 10,
    className,
    style,
    onPointerLeave,
    onPointerMove,
    ...rest
  } = props;

  const follow = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    const box = event.currentTarget.getBoundingClientRect();
    if (box.width === 0 || box.height === 0) {
      return;
    }
    const x = ((event.clientX - box.left) / box.width) * 2 - 1;
    const y = ((event.clientY - box.top) / box.height) * 2 - 1;
    event.currentTarget.style.setProperty("--card-3d-x", x.toFixed(3));
    event.currentTarget.style.setProperty("--card-3d-y", y.toFixed(3));
  };

  const settle = (event: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event);
    event.currentTarget.style.removeProperty("--card-3d-x");
    event.currentTarget.style.removeProperty("--card-3d-y");
  };

  return (
    <div
      className={cn(
        "group/card-3d perspective-[1000px] flex items-center justify-center",
        className
      )}
      data-slot="card-3d"
      style={{ "--card-3d-tilt": `${tilt}deg`, ...style } as CSSProperties}
      {...rest}
      onPointerLeave={settle}
      onPointerMove={follow}
    />
  );
};

/**
 * The card that tilts: it turns to face the pointer, and keeps its
 * children in 3D so each `Card3DItem` can rise off it.
 */
export const Card3DBody = (props: ComponentProps<"div">) => {
  const { className, ...rest } = props;

  return (
    <div
      className={cn(
        "transform-3d *:transform-3d relative",
        "transition-transform duration-200 ease-out",
        "motion-safe:[transform:rotateY(calc(var(--card-3d-x,0)*var(--card-3d-tilt)))_rotateX(calc(var(--card-3d-y,0)*var(--card-3d-tilt)*-1))]",
        className
      )}
      data-slot="card-3d-body"
      {...rest}
    />
  );
};

export interface Card3DItemProps extends useRender.ComponentProps<"div"> {
  /**
   * Its turn about the horizontal axis while the card is hovered: degrees
   * as a number, or any CSS angle.
   *
   * @default 0
   */
  rotateX?: number | string;
  /** Its turn about the vertical axis while hovered. @default 0 */
  rotateY?: number | string;
  /** Its turn in the card's plane while hovered. @default 0 */
  rotateZ?: number | string;
  /**
   * How far it moves across while the card is hovered: pixels as a
   * number, or any CSS length.
   *
   * @default 0
   */
  translateX?: number | string;
  /** How far it moves down while hovered. @default 0 */
  translateY?: number | string;
  /**
   * How far it rises toward the viewer while hovered: the depth that sets
   * it apart from the card. 40 to 100 reads well.
   *
   * @default 0
   */
  translateZ?: number | string;
}

/** A number in a unit, or a CSS value as it is. */
const unit = (value: number | string, suffix: string) =>
  typeof value === "number" ? `${value}${suffix}` : value;

/**
 * A layer of the card. While the card is hovered, or something in it has
 * focus, it moves to its own depth and angle (`translateZ`, `rotateX`…),
 * so layers at different depths part like a pop-up book. With `render`
 * it's the element you give it: an image, a link, a button.
 */
export const Card3DItem = (props: Card3DItemProps) => {
  const {
    translateX = 0,
    translateY = 0,
    translateZ = 0,
    rotateX = 0,
    rotateY = 0,
    rotateZ = 0,
    className,
    style,
    render,
    ...rest
  } = props;

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "w-fit transition-transform duration-200 ease-out",
          "motion-safe:group-hover/card-3d:[transform:var(--card-3d-item)]",
          "motion-safe:group-focus-within/card-3d:[transform:var(--card-3d-item)]",
          className
        ),
        style: {
          "--card-3d-item": `translate3d(${unit(translateX, "px")}, ${unit(translateY, "px")}, ${unit(translateZ, "px")}) rotateX(${unit(rotateX, "deg")}) rotateY(${unit(rotateY, "deg")}) rotateZ(${unit(rotateZ, "deg")})`,
          ...style,
        } as CSSProperties,
      },
      rest
    ),
    render,
    state: { slot: "card-3d-item" },
  });
};