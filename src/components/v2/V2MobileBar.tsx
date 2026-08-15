import Link from "next/link";
import { V2_PHONE_TEL, v2Path } from "@/lib/v2/config";
import { whatsappUrl } from "@/lib/whatsapp";
import { getV2T } from "@/lib/v2/i18n";
import { PhoneIcon, WhatsAppIcon } from "./ui/icons";

/**
 * Barra fixa de mòbil: Trucar · WhatsApp · Pressupost.
 *
 * És la peça que més pot moure la conversió de tot el prototip i la web actual
 * no en té cap. En un negoci local, la major part del trànsit arriba per mòbil
 * buscant "cortines Girona", i la distància entre llegir i trucar ha de ser un
 * dit, no una tornada al capçal.
 *
 * Només es veu per sota de md. En desktop el telèfon ja és a la capçalera.
 */
export default async function V2MobileBar({ locale }: { locale: string }) {
  const t = await getV2T(locale, "V2.mobilebar");
  const tw = await getV2T(locale, "Whatsapp");

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-v2-ink/15 bg-v2-paper/95 backdrop-blur-sm md:hidden">
      <div className="grid grid-cols-3">
        <a
          href={`tel:${V2_PHONE_TEL}`}
          className="flex min-h-[64px] flex-col items-center justify-center gap-1 border-r border-v2-bone text-v2-ink"
        >
          <PhoneIcon className="h-5 w-5" />
          <span className="font-v2-sans text-[0.6875rem] font-semibold uppercase tracking-wider">
            {t("call")}
          </span>
        </a>
        <a
          href={whatsappUrl(tw("budgetIntro"))}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[64px] flex-col items-center justify-center gap-1 border-r border-v2-bone text-v2-ink"
        >
          <WhatsAppIcon className="h-5 w-5" />
          <span className="font-v2-sans text-[0.6875rem] font-semibold uppercase tracking-wider">
            {t("whatsapp")}
          </span>
        </a>
        <Link
          href={v2Path(locale, "pressupost")}
          className="flex min-h-[64px] flex-col items-center justify-center gap-1 bg-v2-ink text-v2-paper"
        >
          <span className="font-v2-sans text-[0.6875rem] font-semibold uppercase tracking-wider">
            {t("budget")}
          </span>
        </Link>
      </div>
    </div>
  );
}
