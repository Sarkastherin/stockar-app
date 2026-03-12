import { useEffect, useState } from "react";
import { ToggleSwitch } from "flowbite-react";
export default function ToggleInactiveRow({data,setData}: {data: any[]; setData: (data: any[]) => void}) {
  const [showInactive, setShowInactive] = useState(false);
  useEffect(() => {
    if (showInactive) {
      setData(data);
    }
    else {
      setData(data.filter(item => item.active));
    }
  },[showInactive])
  return (
    <div className="mb-4 flex items-center gap-2">
      <ToggleSwitch
        checked={showInactive}
        onChange={setShowInactive}
        label="Mostrar productos inactivos"
      />
    </div>
  );
}
