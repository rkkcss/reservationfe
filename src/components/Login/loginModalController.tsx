// loginModalController.ts
type LoginSuccessAction = () => void;

interface LoginModalController {
    open: (onSuccess?: LoginSuccessAction) => void;
    close: () => void;
}

interface LoginModal extends LoginModalController {
    _onSuccessCallback?: LoginSuccessAction;
}

let controller: LoginModalController | null = null;

export const setLoginModalController = (newController: LoginModalController | null) => {
    controller = newController;
};

export const loginModal: LoginModal = {
    _onSuccessCallback: undefined,

    open: (onSuccess?: LoginSuccessAction) => controller?.open(onSuccess),
    close: () => controller?.close(),
};