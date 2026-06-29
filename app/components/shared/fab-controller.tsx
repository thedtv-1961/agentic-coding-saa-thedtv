"use client";

import { useState } from "react";
import WidgetButton from "@/app/components/shared/widget-button";
import TheLEDrawer from "@/app/components/shared/the-le-drawer";
import VietKudosModal from "@/app/components/kudos/viet-kudos-modal";

interface FabControllerProps {
  userId: string;
}

export function FabController({ userId }: FabControllerProps) {
  const [fabExpanded, setFabExpanded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleRulesClick = () => {
    setFabExpanded(false);
    setDrawerOpen(true);
  };

  const handleWriteKudosClick = () => {
    setFabExpanded(false);
    setDrawerOpen(false);
    setModalOpen(true);
  };

  const handleKudosSent = () => {
    setModalOpen(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <>
      <WidgetButton
        isExpanded={fabExpanded}
        onToggle={() => setFabExpanded((v) => !v)}
        onRulesClick={handleRulesClick}
        onWriteKudosClick={handleWriteKudosClick}
      />
      <TheLEDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onWriteKudos={handleWriteKudosClick}
      />
      <VietKudosModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleKudosSent}
        userId={userId}
      />
      {showSuccessToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 right-6 z-[80] bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium"
        >
          Kudos đã được gửi thành công!
        </div>
      )}
    </>
  );
}
