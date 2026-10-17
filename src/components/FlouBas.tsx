/* Flou progressif fixe en bas de la fenêtre, sous la barre « actus » du
   widget (17/10/2026) : copie exacte de .os-blur (5 paliers + voile noir). */
import { useLocation } from "react-router-dom";

const SANS_WIDGET = /^\/(agent\/|selection\/|admin|espace-client|onboarding|login|signup|forgot-password|settings|chat|catalogue)/;

const css = `
.flou-bas{position:fixed;inset:auto 0 0;height:130px;z-index:898;pointer-events:none}
.flou-bas>span{position:absolute;inset:0}
.flou-bas>span:nth-child(1){-webkit-backdrop-filter:blur(1px);backdrop-filter:blur(1px);-webkit-mask-image:linear-gradient(#0000 0%,#000 20% 40%,#0000 55%);mask-image:linear-gradient(#0000 0%,#000 20% 40%,#0000 55%)}
.flou-bas>span:nth-child(2){-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);-webkit-mask-image:linear-gradient(#0000 20%,#000 40% 60%,#0000 75%);mask-image:linear-gradient(#0000 20%,#000 40% 60%,#0000 75%)}
.flou-bas>span:nth-child(3){-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);-webkit-mask-image:linear-gradient(#0000 40%,#000 60% 80%,#0000 95%);mask-image:linear-gradient(#0000 40%,#000 60% 80%,#0000 95%)}
.flou-bas>span:nth-child(4){-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);-webkit-mask-image:linear-gradient(#0000 60%,#000 80%);mask-image:linear-gradient(#0000 60%,#000 80%)}
.flou-bas>span:nth-child(5){-webkit-backdrop-filter:blur(24px) saturate(1.15);backdrop-filter:blur(24px) saturate(1.15);-webkit-mask-image:linear-gradient(#0000 78%,#000 96%);mask-image:linear-gradient(#0000 78%,#000 96%)}
`;

export default function FlouBas() {
  const { pathname } = useLocation();
  if (SANS_WIDGET.test(pathname)) return null;
  return (
    <>
      <style>{css}</style>
      <div aria-hidden="true" className="flou-bas"><span /><span /><span /><span /><span /></div>
    </>
  );
}
