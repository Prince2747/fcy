import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export function Loader() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout> | undefined;

        const showLoader = () => {
            timeout = setTimeout(() => setVisible(true), 250);
        };

        const hideLoader = () => {
            if (timeout) {
                clearTimeout(timeout);
            }

            setVisible(false);
        };

        const removeStartListener = router.on('start', showLoader);
        const removeFinishListener = router.on('finish', hideLoader);

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }

            removeStartListener();
            removeFinishListener();
        };
    }, []);

    if (!visible) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-black/90">
            <div className="relative size-14">
                {/* Red segment */}
                <div className="absolute inset-0 rounded-full border-[5px] border-transparent border-t-red-600 animate-spin" style={{ animationDuration: '0.8s' }} />
                {/* Black segment */}
                <div className="absolute inset-0 rounded-full border-[5px] border-transparent border-r-black dark:border-r-white animate-spin" style={{ animationDuration: '1.2s', animationDirection: 'reverse' }} />
                {/* White/transparent center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-2.5 rounded-full bg-red-600 dark:bg-red-500" />
                </div>
            </div>
        </div>
    );
}