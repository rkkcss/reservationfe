let controller: { open: () => void; close: () => void } | null = null;

export const setLoginModalController = (newController: typeof controller) => {
    controller = newController;
};

export const loginModal = {
    open: () => controller?.open(),
    close: () => controller?.close(),
};