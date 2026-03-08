import { useRef, useState } from "react";
import ReactSignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Eraser, Check } from "lucide-react";

interface SignaturePadProps {
  onSave: (dataUrl: string | null) => void;
}

export default function SignaturePad({ onSave }: SignaturePadProps) {
  const sigRef = useRef<ReactSignatureCanvas>(null);
  const [saved, setSaved] = useState(false);

  const clear = () => {
    sigRef.current?.clear();
    setSaved(false);
    onSave(null);
  };

  const save = () => {
    if (sigRef.current?.isEmpty()) return;
    const dataUrl = sigRef.current?.toDataURL("image/png");
    if (dataUrl) {
      onSave(dataUrl);
      setSaved(true);
    }
  };

  return (
    <div className="space-y-3">
      <div className={`border-2 border-dashed rounded-xl overflow-hidden bg-white ${saved ? "border-green-400" : "border-border"}`}>
        <ReactSignatureCanvas
          ref={sigRef}
          canvasProps={{
            className: "w-full h-[160px]",
            style: { width: "100%", height: 160 },
          }}
          penColor="#111"
          backgroundColor="white"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={clear}>
          <Eraser className="w-4 h-4 mr-1" /> Effacer
        </Button>
        <Button size="sm" onClick={save} disabled={saved}>
          <Check className="w-4 h-4 mr-1" /> {saved ? "Validée" : "Valider la signature"}
        </Button>
      </div>
    </div>
  );
}
