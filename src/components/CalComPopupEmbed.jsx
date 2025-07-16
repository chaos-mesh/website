import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function CalComPopupEmbed() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({"namespace":"talk-to-chaos-mesh-maintainers"});
      cal("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
    })();
  }, []);

  const handleCalClick = async () => {
    const cal = await getCalApi({"namespace":"talk-to-chaos-mesh-maintainers"});
    cal("openModal", {"calLink":"strrl/talk-to-chaos-mesh-maintainers","config":{"layout":"month_view"}});
  };

  return (
    <button 
      onClick={handleCalClick}
      style={{
        backgroundColor: '#000000',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '20px',
        cursor: 'pointer'
      }}
    >
      Talk to Maintainers
    </button>
  );
}