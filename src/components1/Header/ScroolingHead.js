import React, { useEffect, useState } from 'react'
function ScroolingHead() {
  const messages = ["WE ARE ACCEPTING ORDERS TO UK NOW", "NO DELIVERIES ON SUNDAYS AND PUBLIC HOLIDAYS", "NO DELIVERIES ON SUNDAYS AND PUBLIC HOLIDAYS"]
  const [indexValue, setIndexValue] = useState(0);
  const [scroolValue, setScroolValue] = useState({})
  useEffect(() => {
    const interval = setInterval(() => {
      setScroolValue({ transform: "translateX(0)", })
      setTimeout(() => {
        setScroolValue({
          transform: "translateX(-100vw)",
          transition: "transform 1s linear,opacity 0.5s ease-in-out"
        })
      }, 1000)
      setTimeout(() => { setIndexValue((previousData) => (previousData + 1) % messages.length) }, 1000)
    }, 2000)
  }, [])
  return (
    <div style={{ backgroundColor: "#13398d", color: "white" }}>
      <div style={{ textAlign: "center", ...scroolValue }}>{messages[indexValue]}</div>


    </div>
  )
}

export default ScroolingHead