/** Matches backend enum class names in `QuantityServiceImpl#getUnit`. */
export const MEASUREMENT_TYPES = [
  { value: 'LengthUnit', label: 'Length' },
  { value: 'WeightUnit', label: 'Weight' },
  { value: 'VolumeUnit', label: 'Volume' },
  { value: 'TemperatureUnit', label: 'Temperature' },
]

/** Enum names as expected by the Spring `valueOf` calls. */
export const UNITS_BY_TYPE = {
  LengthUnit: ['FEET', 'INCHES', 'YARDS', 'CENTIMETERS', 'METER'],
  WeightUnit: ['KILOGRAM', 'GRAM', 'POUND'],
  VolumeUnit: ['LITRE', 'MILLILITRE', 'GALLON'],
  TemperatureUnit: ['CELSIUS', 'FAHRENHEIT', 'KELVIN'],
}

export const OPERATIONS = [
  { value: 'ADD', label: 'Add', needsTwo: true },
  { value: 'SUBTRACT', label: 'Subtract', needsTwo: true },
  { value: 'MULTIPLY', label: 'Multiply', needsTwo: true },
  { value: 'DIVIDE', label: 'Divide', needsTwo: true },
  { value: 'COMPARE', label: 'Compare', needsTwo: true },
  { value: 'CONVERT', label: 'Convert', needsTwo: false },
]
