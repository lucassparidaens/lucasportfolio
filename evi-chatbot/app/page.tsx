import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import ChatShell from "@/components/ChatShell";
import { Suspense } from "react";

const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false,
});

export default async function Page() {
  const accessToken = await getHumeAccessToken();

  if (!accessToken) {
    throw new Error('Unable to get access token');
  }

  return (
    <div className={"grow flex flex-col"}>
      <Hero />
      <div id="chat" className="relative container mx-auto px-6 max-w-[1200px] w-full">
        <Suspense>
          <ChatShell onStart={() => {
            // The Start button is handled inside Chat via StartCall overlay
            // Users will see the Start overlay; clicking Start in header will scroll into view
            const el = document.getElementById('chat');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}>
            <Chat accessToken={accessToken} />
          </ChatShell>
        </Suspense>
      </div>
    </div>
  );
}
