import { createStore } from "@tanstack/react-store";

export interface INavbarStore {
  isActive: boolean;
}

export const MENU_INITIAL_VALUES: INavbarStore = {
  isActive: false,
};

export const store = createStore<INavbarStore>(MENU_INITIAL_VALUES);

export const updateNavbarIsActive = (isActive: boolean) => {
  store.setState((prev) => ({
    ...prev,
    isActive: isActive,
  }));
};

export const resetNavbarStore = () => {
  store.setState(() => MENU_INITIAL_VALUES);
};
