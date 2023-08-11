import {
  FC,
  ReactElement,
  UIEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react'
import { clsx } from 'clsx'

import debounce from 'app/utils/debounce'

import styles from './Swiper.module.css'

type SwiperProps = React.HTMLAttributes<HTMLElement> & {
  children: ReactElement<HTMLElement> | ReactElement<HTMLElement>[]
  direction: SwiperDirection
}

type SwiperDirection = 'vertical' | 'horizontal'
type SwiperComponent = FC<SwiperProps>

export const Swiper: SwiperComponent = (props: SwiperProps) => {
  const { children, direction, className, ...restOfProps } = props
  const [isStartOfSwiper, setIsStartOfSwiper] = useState(true)
  const [isEndOfSwiper, setIsEndOfSwiper] = useState(true)
  const swiperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const element = swiperRef.current
    if (element) {
      const { size, scrollMax } = getSizes(element, direction)
      if (scrollMax > size) {
        setIsEndOfSwiper(false)
      }
    }
  }, [direction])

  const classNames = clsx(
    styles.swiperWrap,
    direction === 'horizontal' ? styles.horizontalSlide : styles.verticalSlide,
    className,
  )

  const handleOnScroll: UIEventHandler<HTMLDivElement> = (event) => {
    const { size, scroll, scrollMax } = getSizes(
      event.target as HTMLElement,
      direction,
    )
    if (scroll > 10) {
      setIsStartOfSwiper(false)
    } else {
      setIsStartOfSwiper(true)
    }

    if (scrollMax <= scroll + size) {
      setIsEndOfSwiper(true)
    } else {
      setIsEndOfSwiper(false)
    }
  }

  return (
    <div className={classNames} {...restOfProps}>
      <div
        ref={swiperRef}
        className={styles.swiper}
        onScroll={debounce(handleOnScroll)}
      >
        {children}
      </div>

      {!isStartOfSwiper && (
        <div className={styles.swiperPreviousItemsIndicator} aria-hidden></div>
      )}
      {!isEndOfSwiper && (
        <div className={styles.swiperNextItemsIndicator} aria-hidden></div>
      )}
    </div>
  )
}

function getSizes(element: HTMLElement, direction: SwiperDirection) {
  const size =
    direction === 'vertical' ? element.clientHeight : element.clientWidth
  const scroll =
    direction === 'vertical' ? element.scrollTop : element.scrollLeft
  const scrollMax =
    direction === 'vertical' ? element.scrollHeight : element.scrollWidth

  return { size, scroll, scrollMax }
}
