const sidebarNav = document.getElementById('sidebar_nav')
const openSidebar_btn = document.getElementById('sidebar_logo')
const sidebarLogo = document.querySelector('.sidebar_logo')
const newWidget_btn = document.getElementById('new_widget_btn')
const addClock_btn = document.getElementById('add_clock_btn')
const settings_btn = document.getElementById('settings_btn')
const createWidget_btn = document.getElementById('create_widget_btn')
const closeSidebarIcon = document.getElementById('close_sidebar')
const saveSettings_btn = document.getElementById('save_settings_btn')

const newWidget_modal = document.getElementById('new_widget_modal')
const addClock_modal = document.getElementById('add_clock_modal')
const settings_modal = document.getElementById('settings_modal')

const bgImage = document.getElementById('main_container')
const dropzones_container = document.getElementById('widgethub_grid_container')
const dropzones = document.querySelectorAll('.widget_dropzone')
const dropzoneSize = document.querySelector('.dropzone_size')
const createZone = document.getElementById('create_zone')

const handleColors = document.querySelectorAll('.color_pick')
const handleLink = document.getElementById('link')
const handleImage = document.getElementById('image')
const handleSizes = document.querySelectorAll('.size_pick')
const handleTypes = document.querySelectorAll('.type_box')
const handleSettingsColors = document.querySelectorAll('.settings_color')
const handleTitle = document.getElementById('title')  
const handleSettingsImage = document.getElementById('settings_image')


let smallSize = {
    width: dropzoneSize.clientWidth,
    height: dropzoneSize.clientHeight
}

let mediumSize = {
    width:  (dropzoneSize.clientWidth * 2) + 14,
    height: (dropzoneSize.clientHeight * 2) + 26
}

let largeSize = {
    width: (dropzoneSize.clientWidth * 3) + (14 * 2),
    height: (dropzoneSize.clientHeight * 3) + (26 * 2)
}

window.addEventListener('DOMContentLoaded', () => {
    if(localStorage.hasOwnProperty('widgets')) {
        
        widgets = JSON.parse(localStorage.getItem('widgets'))
        console.log('TEM WIDGETS EXISTENTES');
        for(i = 0; i < widgets.length; i++){
            console.log(`Existem ${i} widgets`);
            const existingWidget = document.createElement('div')
            const existingWidget_a = document.createElement('a')
            existingWidget.draggable = true
            existingWidget_a.setAttribute('href', widgets[i].widget_link)
            existingWidget_a.setAttribute('target', '_blank')
            existingWidget.style.backgroundColor = widgets[i].widget_color
            existingWidget.dataset.id = widgets[i].widget_id
            addClass(existingWidget, 'widget')
            if(widgets[i].widget_title !== '') {
                addClass(existingWidget, 'has_title')
                existingWidget.dataset.title = widgets[i].widget_title
            }
    
            existingWidget.addEventListener('dragstart', () => {
                dragStart(existingWidget)
            } )
            existingWidget.addEventListener('dragend', () => {
                dragEnd(existingWidget)
            })
            existingWidget.addEventListener('drag', () => {
                dragWidget(existingWidget)
            })

            if(widgets[i].widget_size == 'small') {
                existingWidget.style.maxWidth = `${smallSize.width}px`
                existingWidget.style.maxHeight = `${smallSize.height}px`
                existingWidget.dataset.size = 'small'   
            } if (widgets[i].widget_size == 'medium') {
                existingWidget.style.maxWidth = `none`
                existingWidget.style.maxHeight = `none`
                existingWidget.style.minWidth = `${mediumSize.width}px`
                existingWidget.style.minHeight = `${mediumSize.height}px`
                existingWidget.dataset.size = 'medium'   
            } if (widgets[i].widget_size == 'large') {
                existingWidget.style.maxWidth = `none`
                existingWidget.style.maxHeight = `none`
                existingWidget.style.minWidth = `${largeSize.width}px`
                existingWidget.style.minHeight = `${largeSize.height}px`
                existingWidget.dataset.size = 'large'   
            }

            existingWidget.style.backgroundImage = widgets[i].widget_image


            dropzones.forEach(zoneId => {
                if(zoneId.dataset.id == existingWidget.dataset.id){
                    console.log(`Achamos as divs ${zoneId.dataset.id}`);

                    existingWidget.appendChild(existingWidget_a)
                    zoneId.appendChild(existingWidget)
                    
                }

                
            })
            console.log(`Esse id existe ${existingWidget.dataset.id}`);
        }
        
    }
})


window.addEventListener('resize', ()=> {
    const widgets = document.querySelectorAll('div.widget')

    console.log('Tela mudou de tamanho');
    let smallSize = {
        width: dropzoneSize.clientWidth,
        height: dropzoneSize.clientHeight
    }
    
    let mediumSize = {
        width:  (dropzoneSize.clientWidth * 2) + 14,
        height: (dropzoneSize.clientHeight * 2) + 26
    }
    
    let largeSize = {
        width: (dropzoneSize.clientWidth * 3) + (14 * 2),
        height: (dropzoneSize.clientHeight * 3) + (26 * 2)
    }

    widgets.forEach(widget => {
        if(widget.dataset.size == 'small') {
            widget.style.maxWidth = `${smallSize.width}px`
            widget.style.maxHeight = `${smallSize.height}px`  
            console.log('Mudou o size do widget small');
        } if (widget.dataset.size == 'medium') {
            widget.style.maxWidth = `none`
            widget.style.maxHeight = `none`
            widget.style.minWidth = `${mediumSize.width}px`
            widget.style.minHeight = `${mediumSize.height}px`
            console.log('Mudou o size do widget medium');
        } if (widget.dataset.size == 'large') {
            widget.style.maxWidth = `none`
            widget.style.maxHeight = `none`
            widget.style.minWidth = `${largeSize.width}px`
            widget.style.minHeight = `${largeSize.height}px`
            console.log('Mudou o size do widget large');
        }
    })
    
})


document.addEventListener('dragover', (e) => e.preventDefault())

dropzones.forEach(dropzone => {
    dropzone.addEventListener('dragenter', dragEnter)
    dropzone.addEventListener('dragleave', dragLeave)
    dropzone.addEventListener('dragover', dragOver)
    dropzone.addEventListener('drop', dropWidget)

    dropzone.style.minWidth = `${dropzoneSize.clientWidth}`
    dropzone.style.minHeight = `${dropzoneSize.clientHeight}`

})

function dragEnter() {
    
}

function dragLeave() {
    removeClass(this, 'dropzone_over')

}

function dragOver() {
    addClass(this, 'dropzone_over')
}

function dropWidget() {
    const newPosition = this
    const hasWidget = newPosition.querySelector('div.widget')
    const widgetDragged = document.querySelector('div.dragging')

    if(hasWidget !== null){
        const lastPosition = document.querySelector('div.last_position')
        lastPosition.appendChild(hasWidget)
        hasWidget.dataset.id = lastPosition.dataset.id
        widgetDragged.dataset.id = newPosition.dataset.id
        localStorage.setItem('widget_id', widgetDragged.dataset.id)
        this.appendChild(widgetDragged)
    } else {
        widgetDragged.dataset.id = this.dataset.id
        localStorage.setItem('widget_id', widgetDragged.dataset.id)
        this.appendChild(widgetDragged)
    }

    refreshID()


}

createWidget_btn.addEventListener('click', () => {
    createWidget()
})

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

closeSidebarIcon.addEventListener('click', closeSidebar)

saveSettings_btn.addEventListener('click', saveSettings)

function saveSettings() {
    const colorSelected = document.querySelector('div.settigs_color_selected')
    const typeSelected = document.querySelector('div.type_selected')
    const widgets = document.querySelectorAll('.widget')

    widgets.forEach(widget => {
        if(typeSelected.dataset.type == 'square') {
            widget.style.borderRadius = 'var(--none-border-radius)'
        }
        if(typeSelected.dataset.type == 'small') {
            widget.style.borderRadius = 'var(--medium-border-radius)'
        }
        if(typeSelected.dataset.type == 'medium') {
            widget.style.borderRadius = 'var(--large-border-radius)'
        }
    })
    const image = handleSettingsImage.dataset.image
    bgImage.style.backgroundImage = image
    bgImage.style.backgroundColor = colorSelected.dataset.color
    
}

handleSettingsImage.addEventListener('change', function (e) {
    const inputTarget = e.target
    const file = inputTarget.files[0]

    const reader = new FileReader()
    
    reader.addEventListener('load', function(e) {
        const readerTarget = e.target
        handleSettingsImage.dataset.image = `url(${readerTarget.result})` 
        saveSettings()
        
    })
    
    reader.readAsDataURL(file)
})


function createWidget() {
    const colorSelected = document.querySelector('div.color_selected')
    const sizeSelected = document.querySelector('div.size_selected')

    
    if(handleLink.value !== '' && colorSelected !== null && sizeSelected !== null) {
        let widgets = new Array()
        const newWidget = document.createElement('div')
        const newWidget_a = document.createElement('a')
        newWidget.draggable = true
        newWidget_a.dataset.link = handleLink.value
        newWidget_a.setAttribute('href', handleLink.value)
        newWidget_a.setAttribute('target', '_blank')
        newWidget.style.backgroundColor = colorSelected.dataset.color
        addClass(newWidget, 'widget')


        if(localStorage.hasOwnProperty('widgets')){
            widgets = JSON.parse(localStorage.getItem('widgets'))
        }

        widgets.push({widget_link: handleLink.value,
                    widget_title: handleTitle.value,
                    widget_size: sizeSelected.dataset.size, 
                    widget_color: colorSelected.dataset.color, 
                    widget_image: handleImage.dataset.image,
                    widget_id: 0 
                })


        localStorage.setItem('widgets', JSON.stringify(widgets))  

        if(sizeSelected.dataset.size == 'small') {
            newWidget.style.maxWidth = `${smallSize.width}px`
            newWidget.style.maxHeight = `${smallSize.height}px`
            newWidget.dataset.size = 'small'   
        } if (sizeSelected.dataset.size == 'medium') {
            newWidget.style.maxWidth = `none`
            newWidget.style.maxHeight = `none`
            newWidget.style.minWidth = `${mediumSize.width}px`
            newWidget.style.minHeight = `${mediumSize.height}px`
            newWidget.dataset.size = 'medium'   
        } if (sizeSelected.dataset.size == 'large') {
            newWidget.style.maxWidth = `none`
            newWidget.style.maxHeight = `none`
            newWidget.style.minWidth = `${largeSize.width}px`
            newWidget.style.minHeight = `${largeSize.height}px`
            newWidget.dataset.size = 'large'   
        }

        if(handleTitle.value !== '') {
            addClass(newWidget, 'has_title')
            newWidget.dataset.title = handleTitle.value
        }

        newWidget.addEventListener('dragstart', () => {
            dragStart(newWidget)
        } )
        newWidget.addEventListener('dragend', () => {
            dragEnd(newWidget)
        })
        newWidget.addEventListener('drag', () => {
            dragWidget(newWidget)
        })
        
        const image = handleImage.dataset.image
        newWidget.style.backgroundImage = image
        
        newWidget.appendChild(newWidget_a)
        createZone.appendChild(newWidget)
        closeModal(newWidget_modal)
        cleanNewWidgetModal()
        removeClass(newWidget_btn, 'modal_openned')

        console.log(newWidget);
        
        
    } else {
        return
    }
}

function refreshID(){
    if(localStorage.hasOwnProperty('widgets')){
        widgets = JSON.parse(localStorage.getItem('widgets'))
    }
    
    const widgetDragged = document.querySelector('div.dragging')
    
    for(i = 0; i < widgets.length; i++) {
        if(widgets[i].widget_title == widgetDragged.dataset.title){
            widgets[i].widget_id = widgetDragged.dataset.id
            console.log(widgets[i]);

            localStorage.setItem('widgets', JSON.stringify(widgets)) 
            
        }
    }
    
}





handleImage.addEventListener('change', function (e) {
    const inputTarget = e.target
    const file = inputTarget.files[0]

    const reader = new FileReader()
    
    reader.addEventListener('load', function(e) {
        const readerTarget = e.target
        createWidget()
        handleImage.dataset.image = `url(${readerTarget.result})` 
        
    })
    
    reader.readAsDataURL(file)
})


function cleanNewWidgetModal() {
    handleColors.forEach(handleColor => {
        removeClass(handleColor, 'color_selected')
    })

    handleSizes.forEach(handleSize => {
        removeClass(handleSize, 'size_selected')
    })

    handleLink.value = ''
    handleTitle.value = ''
    handleImage.value = ''
    handleImage.dataset.image = ''

}

function dragStart(widget) {
    const handleWidget = widget
    const lastPosition = handleWidget.parentElement
    
    dropzones.forEach(dropzone => addClass(dropzone, 'dropzone_active'))
    
    
    addClass(dropzones_container, 'container_active')
    addClass(lastPosition, 'last_position')
}

function dragEnd(widget) {
    const lastPosition = document.querySelector('div.last_position')
    
    removeClass(widget, 'dragging')
    removeClass(dropzones_container, 'container_active')
    removeClass(lastPosition, 'last_position')
    dropzones.forEach(dropzone => {
        removeClass(dropzone, 'dropzone_active')
        removeClass(dropzone, 'dropzone_over')
    })  

    let smallSize = {
        width: dropzoneSize.clientWidth,
        height: dropzoneSize.clientHeight
    }
    
    let mediumSize = {
        width:  (dropzoneSize.clientWidth * 2) + 14,
        height: (dropzoneSize.clientHeight * 2) + 26
    }
    
    let largeSize = {
        width: (dropzoneSize.clientWidth * 3) + (14 * 2),
        height: (dropzoneSize.clientHeight * 3) + (26 * 2)
    }
 
}

function dragWidget(widget) {
    addClass(widget, 'dragging')
    closeSidebar()

}

handleColors.forEach(handleColor => {
    handleColor.addEventListener('click', selectColor)
    handleColor.style.backgroundColor = handleColor.dataset.color
})

function selectColor() {
    handleColors.forEach(handleColor => {
        removeClass(handleColor, 'color_selected')
    })
    addClass(this, 'color_selected')
}

handleSizes.forEach(handleSize => {
    handleSize.addEventListener('click', selectSize)
})

function selectSize() {
    handleSizes.forEach(handleSize => {
        removeClass(handleSize, 'size_selected')
    })
    addClass(this, 'size_selected')
}

handleTypes.forEach(handleType => {
    handleType.addEventListener('click', selectType)
})

function selectType() {
    handleTypes.forEach(handleType => {
        removeClass(handleType, 'type_selected')
    })
    addClass(this, 'type_selected')
}

handleSettingsColors.forEach(handleSettingsColor => {
    handleSettingsColor.addEventListener('click', selectSettingsColor)
    handleSettingsColor.style.backgroundColor = handleSettingsColor.dataset.color
})

function selectSettingsColor() {
    handleSettingsColors.forEach(handleSettingsColor => {
        removeClass(handleSettingsColor, 'settigs_color_selected')
    })
    addClass(this, 'settigs_color_selected')
}


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
    addClass(closeSidebarIcon, 'sidebar_open')
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
    removeClass(closeSidebarIcon, 'sidebar_open')
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
