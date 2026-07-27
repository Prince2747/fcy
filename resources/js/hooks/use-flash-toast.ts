import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;

            // Handle toast notifications
            const toastData = flash?.toast as FlashToast | undefined;
            if (toastData) {
                toast[toastData.type](toastData.message);
                return;
            }

            // Handle standard Laravel flash messages
            if (flash?.success) {
                toast.success(flash.success);
            }

            if (flash?.error) {
                toast.error(flash.error);
            }

            if (flash?.warning) {
                toast.warning(flash.warning);
            }

            if (flash?.info) {
                toast.info(flash.info);
            }
        });
    }, []);
}
