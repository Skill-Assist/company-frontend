import { useState, FC } from "react";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";

import styles from "./styles.module.scss";
import Image from "next/image";

interface Props {
  data: {
    icon: string;
    id: string;
    title: string;
    copy: string;
  }[];
}

const VerticalCarousel: FC<Props> = ({ data }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Used to determine which items appear above the active item
  const halfwayIndex = Math.ceil(data.length / 2);

  // Usd to determine the height/spacing of each item
  const itemHeight = 250;

  // Used to determine at what point an item is moved from the top to the bottom
  const shuffleThreshold = halfwayIndex * itemHeight;

  // Used to determine which items should be visible. this prevents the "ghosting" animation
  const visibleStyleThreshold = shuffleThreshold / 2;

  // @ts-ignore
  const determinePlacement = (itemIndex) => {
    // If these match, the item is active
    if (activeIndex === itemIndex) return 0;

    if (itemIndex >= halfwayIndex) {
      if (activeIndex > itemIndex - halfwayIndex) {
        return (itemIndex - activeIndex) * itemHeight;
      } else {
        return -(data.length + activeIndex - itemIndex) * itemHeight;
      }
    }

    if (itemIndex > activeIndex) {
      return (itemIndex - activeIndex) * itemHeight;
    }

    if (itemIndex < activeIndex) {
      if ((activeIndex - itemIndex) * itemHeight >= shuffleThreshold) {
        return (data.length - (activeIndex - itemIndex)) * itemHeight;
      }
      return -(activeIndex - itemIndex) * itemHeight;
    }
  };

  const handleClick = (direction: string) => {
    setActiveIndex((prevIndex) => {
      if (direction === "next") {
        if (prevIndex + 1 > data.length - 1) {
          return 0;
        }
        return prevIndex + 1;
      }

      if (prevIndex - 1 < 0) {
        return data.length - 1;
      }

      return prevIndex - 1;
    });
  };

  return (
    <div className={styles.container}>
      <section className={styles.outerContainer}>
        <div className={styles.carouselWrapper}>
          <button
            type="button"
            className={`${styles.carouselButton} ${styles.prev}`}
            onClick={() => handleClick("prev")}
          >
            <BiSolidUpArrow size={25} fill="var(--secondary)" />
          </button>

          <div className={styles.carousel}>
            <div className={styles.slides}>
              <div className={styles.carouselInner}>
                {data.map((item, i) => (
                  <button
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`
                    ${styles.carouselItem}
                    ${activeIndex === i ? styles.active : ""}
                    ${
                      // @ts-ignore
                      Math.abs(determinePlacement(i)) <= visibleStyleThreshold
                        ? styles.visible
                        : ""
                    }
                  `}
                    key={item.id}
                    style={{
                      transform: `translateY(${determinePlacement(i)}px)`,
                    }}
                  >
                    <div className={styles.card}>
                      <Image
                        src={`/icons/${item.icon}`}
                        width={200}
                        height={200}
                        alt={item.icon}
                      />
                      <div>
                        <h1>{item.title}</h1>
                        <p>{item.copy}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            className={`${styles.carouselButton} ${styles.next}`}
            onClick={() => handleClick("next")}
          >
            <BiSolidDownArrow size={25} fill="var(--secondary)" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default VerticalCarousel;
