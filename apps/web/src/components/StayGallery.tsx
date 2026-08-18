import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./StayGallery.module.css";

type StayGalleryProps = {
  images: string[];
  stayTitle: string;
};

function getFocusWrapTarget(
  event: KeyboardEvent,
  first: HTMLButtonElement,
  last: HTMLButtonElement,
) {
  if (event.shiftKey) {
    return document.activeElement === first ? last : null;
  }

  return document.activeElement === last ? first : null;
}

function trapDialogFocus(event: KeyboardEvent, dialog: HTMLDivElement | null) {
  if (event.key !== "Tab") return;

  const focusable = dialog?.querySelectorAll<HTMLButtonElement>(
    "button:not(:disabled)",
  );
  if (!focusable?.length) return;

  const target = getFocusWrapTarget(
    event,
    focusable[0],
    focusable[focusable.length - 1],
  );
  if (!target) return;

  event.preventDefault();
  target.focus();
}

export function StayGallery({ images, stayTitle }: StayGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const closeGallery = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen && returnFocusRef.current) {
      returnFocusRef.current.focus();
      returnFocusRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      const galleryActions: Record<string, () => void> = {
        Escape: closeGallery,
        ArrowRight: () =>
          setSelectedIndex((index) => (index + 1) % images.length),
        ArrowLeft: () =>
          setSelectedIndex(
            (index) => (index - 1 + images.length) % images.length,
          ),
      };
      const galleryAction = galleryActions[event.key];

      if (!galleryAction) {
        trapDialogFocus(event, dialogRef.current);
        return;
      }

      event.preventDefault();
      galleryAction();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeGallery, images.length, isOpen]);

  if (images.length === 0) return null;

  function openGallery(index: number) {
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setSelectedIndex(index);
    setIsOpen(true);
  }

  const supportingImages = images.slice(1, 3);
  const galleryClassName = [
    styles.gallery,
    images.length === 1 ? styles.single : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div className={galleryClassName} aria-label={`${stayTitle} photos`}>
        <button
          type="button"
          className={`${styles.photoButton} ${styles.primaryPhoto}`}
          aria-label={`Open photo 1 of ${images.length}`}
          onClick={() => openGallery(0)}
        >
          <img src={images[0]} alt={`${stayTitle}, photo 1`} />
        </button>

        {supportingImages.map((src, index) => (
          <button
            key={src}
            type="button"
            className={`${styles.photoButton} ${
              supportingImages.length === 1 ? styles.onlySupportPhoto : ""
            }`}
            aria-label={`Open photo ${index + 2} of ${images.length}`}
            onClick={() => openGallery(index + 1)}
          >
            <img src={src} alt={`${stayTitle}, photo ${index + 2}`} />
          </button>
        ))}

        <button
          type="button"
          className={styles.viewAll}
          onClick={() => openGallery(0)}
        >
          View all photos
          <span aria-hidden="true"> · {images.length}</span>
        </button>
      </div>

      {isOpen && (
        <div
          ref={dialogRef}
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`${stayTitle} photo gallery`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeGallery();
          }}
        >
          <div className={styles.lightboxHeader}>
            <p aria-live="polite">
              {selectedIndex + 1} / {images.length}
            </p>
            <button
              ref={closeButtonRef}
              type="button"
              className={styles.lightboxButton}
              onClick={closeGallery}
              aria-label="Close photo gallery"
            >
              Close
            </button>
          </div>

          <div className={styles.lightboxStage}>
            {images.length > 1 && (
              <button
                type="button"
                className={`${styles.lightboxButton} ${styles.previous}`}
                onClick={() =>
                  setSelectedIndex(
                    (index) => (index - 1 + images.length) % images.length,
                  )
                }
                aria-label="Previous photo"
              >
                <span aria-hidden="true">←</span>
              </button>
            )}

            <img
              src={images[selectedIndex]}
              alt={`${stayTitle}, photo ${selectedIndex + 1} of ${images.length}`}
            />

            {images.length > 1 && (
              <button
                type="button"
                className={`${styles.lightboxButton} ${styles.next}`}
                onClick={() =>
                  setSelectedIndex((index) => (index + 1) % images.length)
                }
                aria-label="Next photo"
              >
                <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
