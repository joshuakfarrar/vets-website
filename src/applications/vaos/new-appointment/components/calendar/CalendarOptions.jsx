import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import CalendarOptionsSlots from './CalendarOptionsSlots';

// /*
//  * Simiarly to above, but for checkboxes, which we know we only ever have two of
//  * So calculations are against either the first or the second one
//  */
// function getCheckboxOptionClasses(index) {
//   return classNames('vaos-calendar__option-cell', {
//     'vaos-u-border-radius--top-left': index === 0,
//     'vaos-u-border-radius--top-right': index === 1,
//     'vaos-u-border-radius--bottom-left': index === 0,
//     'vaos-u-border-radius--bottom-right': index === 1,
//     'vads-u-padding-left--2': index === 0,
//     'vads-u-padding-top--2': true,
//     'vads-u-padding-right--2': index === 1,
//   });
// }

const smallMediaQuery = '(min-width: 481px)';
const smallDesktopMediaQuery = '(min-width: 1008px)';

// matches vaos-calendar__option-cell widths
function calculateRowSize() {
  if (matchMedia(smallDesktopMediaQuery).matches) {
    return 4;
  } else if (matchMedia(smallMediaQuery).matches) {
    return 3;
  }

  return 2;
}

export default function CalendarOptions({
  currentlySelectedDate,
  availableSlots,
  handleSelectOption,
  hasError,
  maxSelections,
  renderOptions,
  selectedDates,
  selectedCellIndex,
  optionsHeightRef,
  timezone,
  id,
}) {
  // Because we need to conditionally apply classes to get the right padding
  // and border radius for each cell, we need to know when the page size trips
  // a breakpoint
  const [rowSize, setRowSize] = useState(() => calculateRowSize());
  useEffect(() => {
    function updateRowSize() {
      setRowSize(calculateRowSize());
    }

    const smallMatcher = matchMedia(smallMediaQuery);
    // IE 11 and some versions of Safari don't support addEventListener here
    smallMatcher.addListener(updateRowSize);

    const smallDesktopMatcher = matchMedia(smallDesktopMediaQuery);
    smallDesktopMatcher.addListener(updateRowSize);

    return () => {
      smallMatcher.removeListener(updateRowSize);
      smallDesktopMatcher.removeListener(updateRowSize);
    };
  }, []);
  const containerClasses = classNames('vaos-calendar__options-container');

  return (
    <div
      className={containerClasses}
      id={`vaos-options-container-${currentlySelectedDate}`}
      ref={optionsHeightRef}
    >
      <fieldset>
        <legend className="vads-u-visibility--screen-reader">
          Please select an option for this date
        </legend>
        {!!renderOptions &&
          renderOptions({
            id,
            currentlySelectedDate,
            availableSlots,
            selectedDates,
            rowSize,
            selectedCellIndex,
            maxSelections,
            hasError,
            onChange: handleSelectOption,
            timezone,
          })}
        {!renderOptions && (
          <CalendarOptionsSlots
            id={id}
            currentlySelectedDate={currentlySelectedDate}
            availableSlots={availableSlots}
            selectedDates={selectedDates}
            rowSize={rowSize}
            selectedCellIndex={selectedCellIndex}
            maxSelections={maxSelections}
            hasError={hasError}
            onChange={handleSelectOption}
            timezone={timezone}
          />
        )}
      </fieldset>
    </div>
  );
}
