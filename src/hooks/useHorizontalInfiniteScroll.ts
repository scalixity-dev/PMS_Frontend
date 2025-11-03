import { useRef, useEffect } from "react";

interface UseHorizontalInfiniteScrollOptions {
  scrollAmount?: number;
  threshold?: number;
  initDelay?: number;
}

export const useHorizontalInfiniteScroll = (
  options: UseHorizontalInfiniteScrollOptions = {}
) => {
  const { scrollAmount = 430, threshold = 50, initDelay = 200 } = options;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const getScrollAmount = () => scrollAmount;

  const handlePrevClick = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const amount = getScrollAmount();
    scrollContainer.scrollBy({
      left: -amount,
      behavior: "smooth",
    });
  };

  const handleNextClick = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const amount = getScrollAmount();
    scrollContainer.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const scrollLeft = scrollContainer.scrollLeft;
      const scrollWidth = scrollContainer.scrollWidth;
      const singleSetWidth = scrollWidth / 3;

      // If scrolled to the end of set 2 (near start of set 3), jump back to start of set 2
      // This creates seamless loop when scrolling right
      if (scrollLeft >= singleSetWidth * 2 - threshold) {
        isScrollingRef.current = true;
        scrollContainer.style.scrollBehavior = "auto";
        const excess = scrollLeft - (singleSetWidth * 2 - threshold);
        scrollContainer.scrollLeft = singleSetWidth - threshold + excess;
        requestAnimationFrame(() => {
          scrollContainer.style.scrollBehavior = "smooth";
          isScrollingRef.current = false;
        });
      }
      // If scrolled before the start of set 2 (in set 1), jump forward to corresponding position in set 2
      // This creates seamless loop when scrolling left
      else if (scrollLeft <= singleSetWidth - threshold) {
        isScrollingRef.current = true;
        scrollContainer.style.scrollBehavior = "auto";
        const offset = singleSetWidth - scrollLeft;
        scrollContainer.scrollLeft = singleSetWidth * 2 - threshold - offset;
        requestAnimationFrame(() => {
          scrollContainer.style.scrollBehavior = "smooth";
          isScrollingRef.current = false;
        });
      }
    };

    // Initialize scroll position to the start of the middle set (set 2)
    const initializeScroll = () => {
      const scrollWidth = scrollContainer.scrollWidth;
      if (scrollWidth > 0) {
        const singleSetWidth = scrollWidth / 3;
        scrollContainer.style.scrollBehavior = "auto";
        scrollContainer.scrollLeft = singleSetWidth;
        setTimeout(() => {
          scrollContainer.style.scrollBehavior = "smooth";
        }, 50);
      }
    };

    // Wait for DOM to be fully rendered and layout calculated
    const initTimeout = setTimeout(() => {
      initializeScroll();
    }, initDelay);

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });

    // Handle window resize - reinitialize if needed
    const handleResize = () => {
      const scrollWidth = scrollContainer.scrollWidth;
      const singleSetWidth = scrollWidth / 3;
      const currentScroll = scrollContainer.scrollLeft;

      // If we're outside the middle set after resize, reset to middle set
      if (
        currentScroll < singleSetWidth ||
        currentScroll > singleSetWidth * 2
      ) {
        initializeScroll();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(initTimeout);
      scrollContainer.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [threshold, initDelay]);

  return {
    scrollContainerRef,
    handlePrevClick,
    handleNextClick,
  };
};
