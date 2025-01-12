import React from 'react';
import { isReactComponent } from '../../../../utilities/ui';

import ExpandingGroup from '../components/ExpandingGroup';

export default function RadioWidget({
  options,
  value,
  disabled,
  onChange,
  id,
}) {
  const {
    enumOptions,
    labels = {},
    nestedContent = {},
    widgetProps = {},
  } = options;

  // nested content could be a component or just jsx/text
  let content = nestedContent[value];
  if (isReactComponent(content)) {
    const NestedContent = content;
    content = <NestedContent />;
  }

  return (
    <div>
      {enumOptions.map((option, i) => {
        const checked = option.value === value;
        const radioButton = (
          <div className="form-radio-buttons" key={option.value}>
            <input
              type="radio"
              checked={checked}
              id={`${id}_${i}`}
              name={`${id}`}
              value={option.value}
              disabled={disabled}
              onChange={_ => onChange(option.value)}
              {...widgetProps[option.value] || {}}
            />
            <label htmlFor={`${id}_${i}`}>
              {labels[option.value] || option.label}
            </label>
          </div>
        );

        if (nestedContent[option.value]) {
          return (
            <ExpandingGroup open={checked} key={option.value}>
              {radioButton}
              <div className="schemaform-radio-indent">{content}</div>
            </ExpandingGroup>
          );
        }

        return radioButton;
      })}
    </div>
  );
}
