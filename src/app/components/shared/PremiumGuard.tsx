import { ReactNode, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface PremiumGuardProps {
  isPremium: boolean;
  children: ReactNode;
}

export function PremiumGuard({ isPremium, children }: PremiumGuardProps) {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCapture = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (isPremium) {
        return;
      }

      const target = event.target as HTMLElement;
      const interactive = target.closest("button, a, [role='button'], input[type='button'], input[type='submit']");

      if (!interactive) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      setDialogOpen(true);
    },
    [isPremium]
  );

  return (
    <>
      <div onClickCapture={handleCapture} className="contents">
        {children}
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tính năng VIP</AlertDialogTitle>
            <AlertDialogDescription>
              This is a VIP AI feature. Please upgrade your plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Đóng</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/pricing")}>
              Nâng cấp VIP
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
