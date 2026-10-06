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
      const draft = e.target.value;
      const newValue = draft === '' ? '' : parseFloat(draft);
      if (newValue !== '' && !Number.isFinite(newValue)) return;
      setInputValues((current) => current.map((value, position) => position === index ? newValue : value));
    },
    []
  );
  const validateAndUpdateValue = useCallback(
    (value, index) => {
      const updatedSlider = [...sliderValues];
      const requested = Number.isFinite(value) ? value : sliderValues[index];
      if (index === 0) {
        updatedSlider[0] = Math.max(minValue, Math.min(requested, sliderValues[1]));
      } else {
        updatedSlider[1] = Math.min(maxValue, Math.max(requested, sliderValues[0]));
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
