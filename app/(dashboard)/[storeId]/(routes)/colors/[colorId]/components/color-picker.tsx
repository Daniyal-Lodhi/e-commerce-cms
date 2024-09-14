'use client'

import { Sketch } from '@uiw/react-color';

interface ColorPickerProps {
    setValue:(value:string)=>void
}

const ColorPicker:React.FC<ColorPickerProps> = ({
    setValue,
})=> {
    return (
      <Sketch
        style={{ marginLeft: 20 }}
        onChange={(color) => {
          setValue(color.hex);
        }}
      />
    );
  }

export default ColorPicker;