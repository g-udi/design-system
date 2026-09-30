// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
"use client";
import { useCallback, useState } from "react";
export function useSliderInput({
  minValue,
  maxValue,
  initialValue
}) {
  const [sliderValues, setSliderValues] = useState(initialValue);
  const [inputValues, setInputValues] = useState(initialValue);
  const handleSliderChange = useCallback((values) => {
    setSliderValues(values);
    setInputValues(values);
  }, []);
  const handleInputChange = useCallback(
    (e, index) => {
      const newValue = parseFloat(e.target.value);
      if (!isNaN(newValue)) {
        const updatedInputs = [...inputValues];
        updatedInputs[index] = newValue;
        setInputValues(updatedInputs);
      }
    },
    [inputValues]
  );
  const validateAndUpdateValue = useCallback(
    (value, index) => {
      const updatedSlider = [...sliderValues];
      if (index === 0) {
        updatedSlider[0] = Math.max(minValue, Math.min(value, sliderValues[1]));
      } else {
        updatedSlider[1] = Math.min(maxValue, Math.max(value, sliderValues[0]));
      }
      setSliderValues(updatedSlider);
      setInputValues(updatedSlider);
    },
    [sliderValues, minValue, maxValue]
  );
  return {
    setSliderValues,
    setInputValues,
    sliderValues,
    inputValues,
    handleSliderChange,
    handleInputChange,
    validateAndUpdateValue
  };
}
