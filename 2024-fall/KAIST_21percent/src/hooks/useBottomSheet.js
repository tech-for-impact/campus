import { useRef, useEffect } from 'react';

// constants
export const MIN_Y = 120; // 바텀시트가 최대로 높이 올라갔을 때의 y 값
export const MAX_Y = window.innerHeight - 400; // 바텀시트가 최소로 내려갔을 때의 y 값
export const BOTTOM_SHEET_HEIGHT = window.innerHeight - MIN_Y; // 바텀시트의 세로 길이

export function useBottomSheet(setIsExpanded, selectedParty) {
  const sheetRef = useRef(null);
  const contentRef = useRef(null);

  const metrics = useRef({
    touchStart: {
      sheetY: 0, // touchstart에서 BottomSheet의 최상단 모서리의 Y값
      touchY: 0, // touchstart에서 터치 포인트의 Y값
    },
    touchMove: {
      prevTouchY: 0, // 다음 touchmove 이벤트 핸들러에서 필요한 터치 포인트 Y값을 저장
      movingDirection: 'none', // 유저가 터치를 움직이고 있는 방향  | "down" | "up"
    },
    isContentAreaTouched: false, // 컨텐츠 영역을 터치하고 있음을 기록
  });

  const canUserMoveBottomSheet = () => {
    // Prevent movement if there is a selected party
    if (selectedParty) {
      return false;
    }

    const { touchMove, isContentAreaTouched } = metrics.current;

    // 바텀시트에서 컨텐츠 영역이 아닌 부분을 터치하면 항상 바텀시트 움직이기
    if (!isContentAreaTouched) {
      return true;
    }

    // 바텀시트가 올라와있는 상태가 아닐 때는 컨텐츠 영역을 터치해도 바텀시트를 움직이기
    if (sheetRef.current.getBoundingClientRect().y !== MIN_Y) {
      // console.log(sheetRef.current.getBoundingClientRect().y); // test
      return true;
    }

    if (touchMove.movingDirection === 'down') {
      // 스크롤을 더 이상 올릴 것이 없다면, 바텀시트를 움직이기
      // Safari 에서는 bounding 효과 때문에 scrollTop 이 음수가 될 수 있음
      return contentRef.current.scrollTop <= 0;
    }

    return false;
  };

  useEffect(() => {
    // touch start
    const handleTouchStart = (e) => {
      const { touchStart } = metrics.current;

      touchStart.sheetY = sheetRef.current.getBoundingClientRect().y || 0;
      touchStart.touchY = e.touches[0].clientY;

      metrics.current.touchMove.prevTouchY = touchStart.touchY; // Initialize prevTouchY on start
      console.log('Touch Start: Y Position of Sheet:', touchStart.sheetY);
    };

    // touch move
    const handleTouchMove = (e) => {
      const { touchStart, touchMove } = metrics.current;
      const currentTouch = e.touches[0];

      if (touchMove.prevTouchY === undefined) {
        touchMove.prevTouchY = touchStart.touchY;
      }

      if (touchMove.prevTouchY < currentTouch.clientY) {
        touchMove.movingDirection = 'down';
      }

      if (touchMove.prevTouchY > currentTouch.clientY) {
        touchMove.movingDirection = 'up';
      }

      if (canUserMoveBottomSheet()) {
        // content에서 scroll이 발생하는 것을 막기
        e.preventDefault();

        // 터치 시작점에서부터 현재 터치 포인트까지의 변화된 y값
        const touchOffset = currentTouch.clientY - touchStart.touchY;
        let nextSheetY = touchStart.sheetY + touchOffset;

        // nextSheetY 는 MIN_Y와 MAX_Y 사이의 값으로 clamp
        if (nextSheetY <= MIN_Y) {
          nextSheetY = MIN_Y;
        }

        if (nextSheetY >= MAX_Y) {
          nextSheetY = MAX_Y;
        }

        // sheet 위치 갱신
        sheetRef.current.style.setProperty(
          'transform',
          `translateY(${nextSheetY - MAX_Y}px)`
        );
      } else {
        // 컨텐츠를 스크롤하는 동안에는 body가 스크롤되는 것을 막기
        document.body.style.overflowY = 'hidden';
      }

      console.log('handle touch move done');
    };

    // touch end
    const handleTouchEnd = () => {
      document.body.style.overflowY = 'auto';

      const { touchMove } = metrics.current;
      const currentSheetY = sheetRef.current.getBoundingClientRect().y;

      if (currentSheetY !== MIN_Y) {
        if (touchMove.movingDirection === 'down') {
          console.log('TOUCHEND: moving down');
          setIsExpanded(false);
          sheetRef.current.style.setProperty('transform', 'translateY(0)');
        } else if (touchMove.movingDirection === 'up') {
          console.log('TOUCHEND: moving up');
          setIsExpanded(true);
          sheetRef.current.style.setProperty(
            'transform',
            `translateY(${MIN_Y - MAX_Y}px)`
          );
        }
      }

      metrics.current = {
        touchStart: {
          sheetY: 0,
          touchY: 0,
        },
        touchMove: {
          prevTouchY: 0,
          movingDirection: 'none',
        },
        isContentAreaTouched: false,
      };

      console.log('handle touch end done');
    };

    const sheet = sheetRef.current;

    if (sheet) {
      sheet.addEventListener('touchstart', handleTouchStart);
      sheet.addEventListener('touchmove', handleTouchMove);
      sheet.addEventListener('touchend', handleTouchEnd);
      console.log('event listeners added');
    }

    return () => {
      if (sheet) {
        sheet.removeEventListener('touchstart', handleTouchStart);
        sheet.removeEventListener('touchmove', handleTouchMove);
        sheet.removeEventListener('touchend', handleTouchEnd);
        console.log('event listeners removed');
      }
    };
  }, [selectedParty]);

  // content 영역을 터치하는 것을 기록
  useEffect(() => {
    const handleContentTouchStart = () => {
      metrics.current.isContentAreaTouched = true;
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener('touchstart', handleContentTouchStart);
    }

    return () => {
      if (content) {
        content.removeEventListener('touchstart', handleContentTouchStart);
      }
    };
  }, []);

  return { sheetRef, contentRef };
}
