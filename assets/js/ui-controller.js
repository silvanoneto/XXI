/**
 * Controlador de UI (sidebar, fonte)
 * Single Responsibility: Controles de interface
 */
class UIController {
    constructor(stateManager) {
        this.state = stateManager;
        this.sidebar = document.querySelector(Config.selectors.sidebar);
    }

    toggleSidebar() {
        if (this.sidebar) {
            this.sidebar.classList.toggle("visible");
            this.sidebar.classList.toggle("hidden");
        }
    }

    closeSidebarOnMobile() {
        // Fecha apenas em mobile/tablet
        if (window.innerWidth <= Config.ui.mobileBreakpoint && this.sidebar) {
            this.sidebar.classList.remove("visible");
            this.sidebar.classList.add("hidden");
        }
    }

    // Fecha sidebar em qualquer tela após selecionar item
    closeSidebar() {
        if (this.sidebar && window.innerWidth <= Config.ui.mobileBreakpoint) {
            this.sidebar.classList.remove("visible");
            this.sidebar.classList.add("hidden");
        }
    }

    increaseFontSize() {
        this.state.setFontSize(this.state.fontSize + Config.ui.fontSize.step);
    }

    decreaseFontSize() {
        this.state.setFontSize(this.state.fontSize - Config.ui.fontSize.step);
    }
}
