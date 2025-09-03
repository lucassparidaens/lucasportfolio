import { useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

export default function StartCall({ configId, accessToken }: { configId?: string, accessToken: string }) {
  const { status, connect } = useVoice();

  useEffect(() => {
    const handler = () => {
      connect({ 
        auth: { type: "accessToken", value: accessToken },
        configId,
      }).catch(() => {
        toast.error("Unable to start call");
      });
    };
    window.addEventListener("lucas:start-call", handler);
    return () => window.removeEventListener("lucas:start-call", handler);
  }, [accessToken, configId, connect]);

  return (
    <AnimatePresence>
      {status.value !== "connected" ? (
        <motion.div
          className={"absolute inset-0 p-4 flex items-center justify-center bg-background/95"}
          initial="initial"
          animate="enter"
          exit="exit"
          variants={{
            initial: { opacity: 0 },
            enter: { opacity: 1 },
            exit: { opacity: 0 },
          }}
        >
          <AnimatePresence>
            <motion.div
              variants={{
                initial: { scale: 0.9 },
                enter: { scale: 1 },
                exit: { scale: 0.9 },
              }}
            >
              <Button
                className={"z-50 flex items-center gap-1.5 rounded-full"}
                onClick={() => {
                  connect({ 
                    auth: { type: "accessToken", value: accessToken },
                    configId, 
                  })
                    .then(() => {})
                    .catch(() => {
                      toast.error("Unable to start call");
                    })
                    .finally(() => {});
                }}
              >
                <span>
                  <Phone
                    className={"size-4 opacity-50 fill-current"}
                    strokeWidth={0}
                  />
                </span>
                <span>Start Call</span>
              </Button>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
