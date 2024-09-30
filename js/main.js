const sidebarNav = document.getElementById('sidebar_nav')
const openSidebar_btn = document.getElementById('sidebar_logo')
const sidebarLogo = document.querySelector('.sidebar_logo')
const newWidget_btn = document.getElementById('new_widget_btn')
const addClock_btn = document.getElementById('add_clock_btn')
const settings_btn = document.getElementById('settings_btn')

const newWidget_modal = document.getElementById('new_widget_modal')
const addClock_modal = document.getElementById('add_clock_modal')
const settings_modal = document.getElementById('settings_modal')

openSidebar_btn.addEventListener('click', () => {
    if(sidebarNav.classList.contains('close')){
       openSidebar()
    } else {
        closeSidebar()
    }
})

newWidget_btn.addEventListener('click', () => { 
    if(!newWidget_modal.classList.contains('modal_open')){
        openSidebar()
        openModal(newWidget_modal)
        addClass(newWidget_btn, 'modal_openned')
    } else {
        closeModal(newWidget_modal)
        removeClass(newWidget_btn, 'modal_openned')
    }
})

addClock_btn.addEventListener('click', () => {
    if(!addClock_modal.classList.contains('modal_open')){
        openSidebar()
        openModal(addClock_modal)
        addClass(addClock_btn, 'selected')
    } else {
        closeModal(addClock_modal)
        removeClass(addClock_btn, 'selected')
    }
})

settings_btn.addEventListener('click', () => {
    if(!settings_modal.classList.contains('modal_open')){
        openSidebar()
        openModal(settings_modal)
        addClass(settings_btn, 'selected')
    } else {
        closeModal(settings_modal)
        removeClass(settings_btn, 'selected')
    }
})

function openModal(modal) {
    closeModal(newWidget_modal)
    closeModal(addClock_modal)
    closeModal(settings_modal)
    removeClass(newWidget_btn, 'modal_openned')
    removeClass(addClock_btn, 'selected')
    removeClass(settings_btn, 'selected')
    addClass(modal, 'modal_open')
}

function closeModal(modal) {
    removeClass(modal, 'modal_open')
}

function openSidebar() {
    addClass(sidebarNav, 'open')
    addClass(sidebarLogo, 'active')
    addClass(openSidebar_btn, 'active')
    addClass(newWidget_btn, 'active')
    addClass(newWidget_btn, 'openned')
    addClass(addClock_btn, 'active')
    addClass(settings_btn, 'active')
    removeClass(sidebarNav, 'close')
        
}

function closeSidebar() {
    removeClass(sidebarNav, 'open')
    removeClass(sidebarLogo, 'active')
    removeClass(openSidebar_btn, 'active')
    removeClass(newWidget_btn, 'openned')
    removeClass(newWidget_btn, 'active')
    removeClass(settings_btn, 'active')
    removeClass(addClock_btn, 'active')
    addClass(sidebarNav, 'close')

    closeModal(newWidget_modal)
    closeModal(addClock_modal)
    closeModal(settings_modal)
    removeClass(newWidget_btn, 'modal_openned')
    removeClass(addClock_btn, 'selected')
    removeClass(settings_btn, 'selected')
}

function addClass(el, className) {
    el.classList.add(className)
    return
}

function removeClass(el, className) {
    el.classList.remove(className)
    return
}
