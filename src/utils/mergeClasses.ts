export const mergeClasses = (...classes: Array<string | undefined | null>) =>
    classes.filter(Boolean).join(" ");
