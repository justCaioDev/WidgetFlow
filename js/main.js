const sidebarNav = document.getElementById('sidebar_nav')
const openSidebar_btn = document.getElementById('sidebar_logo')
const sidebarLogo = document.querySelector('.sidebar_logo')
const newWidget_btn = document.getElementById('new_widget_btn')
const addClock_btn = document.getElementById('add_clock_btn')
const settings_btn = document.getElementById('settings_btn')
const createWidget_btn = document.getElementById('create_widget_btn')
const closeSidebarIcon = document.getElementById('close_sidebar')
const closeEditWidget_modal = document.getElementById('close_edit_widget_modal')
const saveSettings_btn = document.getElementById('save_settings_btn')

const newWidget_modal = document.getElementById('new_widget_modal')
const addClock_modal = document.getElementById('add_clock_modal')
const settings_modal = document.getElementById('settings_modal')
const editWidget_modal = document.getElementById('edit_widget_modal')

const bgImage = document.getElementById('main_container')
const dropzones_container = document.getElementById('widgethub_grid_container')
const dropzoneSize = document.querySelector('.dropzone_size')
const createZone = document.getElementById('create_zone')
const deleteZone = document.getElementById('delete_zone')

const handleColors = document.querySelectorAll('.color_pick')
const handleLink = document.getElementById('link')
const handleImage = document.getElementById('image')
const handleSizes = document.querySelectorAll('.size_pick')
const handleTitle = document.getElementById('title')  
const handleTypes = document.querySelectorAll('.type_box')
const handleSettingsColors = document.querySelectorAll('.settings_color')
const handleSettingsImage = document.getElementById('settings_image')
const handleTextColors = document.querySelectorAll('.text_color')
const handleBorders = document.querySelectorAll('.border_color')


const root = document.querySelector(':root')
const rootStyles = getComputedStyle(root)



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

function refreshSizesDefault() {
    smallSize = {
        width: dropzoneSize.clientWidth,
        height: dropzoneSize.clientHeight
    }
    
    mediumSize = {
        width:  (dropzoneSize.clientWidth * 2) + 14,
        height: (dropzoneSize.clientHeight * 2) + 26
    }
    
    largeSize = {
        width: (dropzoneSize.clientWidth * 3) + (14 * 2),
        height: (dropzoneSize.clientHeight * 3) + (26 * 2)
    }
}

refreshSizesDefault()
adjustScreen()

function createZones() {
    const dropzonesExisting = document.querySelectorAll('.widget_dropzone')
    const colums = rootStyles.getPropertyValue('--columns')
    const rows = rootStyles.getPropertyValue('--rows')
    
    const totalDropzonesAvailable = colums * rows
    
    if (dropzonesExisting.length < totalDropzonesAvailable) {
        const isLeft = totalDropzonesAvailable - dropzonesExisting.length
        for(i = 0; i < isLeft; i++) {
            const dropzoneWillExist = document.createElement('div')
            dropzoneWillExist.dataset.id = dropzonesExisting.length + i + 1
            dropzoneWillExist.classList.add('widget_dropzone')
            dropzones_container.appendChild(dropzoneWillExist)
        }
    }
}

createZones()

const dropzones = document.querySelectorAll('.widget_dropzone')

dropzones.forEach(dropzone => {
    dropzone.addEventListener('dragleave', dragLeave)
    dropzone.addEventListener('dragover', dragOver)
    dropzone.addEventListener('drop', dropWidget)

    dropzone.style.minWidth = `${dropzoneSize.clientWidth}`
    dropzone.style.minHeight = `${dropzoneSize.clientHeight}`

})

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
        // editWidget_modal.dataset.id = this.dataset.id
        localStorage.setItem('widget_id', widgetDragged.dataset.id)
        this.appendChild(widgetDragged)
    }
    refreshID()
}


window.addEventListener('DOMContentLoaded', () => {
    const typeSelected = document.querySelector('.type_selected')

    refreshSizesDefault()
    createZones()
    adjustScreen()
    
    if (localStorage.backgroundColor) {
        bgImage.style.backgroundColor = localStorage.getItem('backgroundColor')
        bgImage.style.backgroundImage = localStorage.getItem('backgroundImage')
    }
    
    if(localStorage.hasOwnProperty('widgets')) {
        widgets = JSON.parse(localStorage.getItem('widgets'))
        for(i = 0; i < widgets.length; i++){
            const existingWidget = document.createElement('div')
            const existingWidget_a = document.createElement('a')
            existingWidget.draggable = true
            existingWidget_a.setAttribute('href', widgets[i].widget_link)
            existingWidget_a.setAttribute('target', '_blank')
            existingWidget_a.dataset.link = widgets[i].widget_link
            existingWidget.dataset.link = widgets[i].widget_link
            const editWidget_btn = document.createElement('button')
            editWidget_btn.innerHTML = '<i class="fa-regular fa-pen-to-square fa-sm"></i>'
            existingWidget.style.backgroundColor = widgets[i].widget_color
            existingWidget.dataset.id = widgets[i].widget_id
            existingWidget.classList.add('widget')
            editWidget_btn.classList.add('editWidget')
            if (widgets[i].widget_title !== '') {
                addClass(existingWidget, 'has_title')
                existingWidget.dataset.title = widgets[i].widget_title
            } else {
                existingWidget.dataset.title = ''
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

            editWidget_btn.addEventListener('click', ()=> {
                editWidget(existingWidget)
                existingWidget.classList.add('editing')
                editWidget_modal.dataset.id = existingWidget.dataset.id
            })

            // refreshSizesDefault()

            if (widgets[i].widget_size == 'small') {
                existingWidget.style.minWidth = `${smallSize.width}px`
                existingWidget.style.minHeight = `${smallSize.height}px`
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
                if (zoneId.dataset.id == existingWidget.dataset.id){
                    existingWidget.appendChild(existingWidget_a)
                    existingWidget.appendChild(editWidget_btn)
                    zoneId.appendChild(existingWidget)
                }
            })
        }
        
        const allWidgets = document.querySelectorAll('.widget')

        if(localStorage.settings_type){
            typeSelected.classList.remove('type_selected')
            handleTypes.forEach(handleType => {
                handleType.classList.remove('type_selected')
                if (handleType.dataset.type == localStorage.settings_type){
                    handleType.classList.add('type_selected')
                }
            })
            allWidgets.forEach(widget => {
                if (localStorage.text_color) {
                    widget.style.color = localStorage.text_color
                }
                
                if (localStorage.border) {
                    widget.style.boxShadow = `3px 4px ${localStorage.border}`
                }

                if (localStorage.settings_type == 'square') {
                    const squareType = document.querySelector("[data-type='square']")
                    squareType.classList.add('type_selected')
                    const typeSelected = document.querySelector('.type_selected')
                    widget.style.borderRadius = 'var(--none-border-radius)'
                    localStorage.setItem('settings_type', typeSelected.dataset.type)
                } if (localStorage.settings_type == 'small') {
                    const smallType = document.querySelector("[data-type='small']")
                    smallType.classList.add('type_selected')
                    const typeSelected = document.querySelector('.type_selected')
                    widget.style.borderRadius = 'var(--medium-border-radius)'
                    localStorage.setItem('settings_type', typeSelected.dataset.type)
                } if (localStorage.settings_type == 'medium') {
                    const mediumType = document.querySelector("[data-type='medium']")
                    mediumType.classList.add('type_selected')
                    const typeSelected = document.querySelector('.type_selected')
                    widget.style.borderRadius = 'var(--large-border-radius)'
                    localStorage.setItem('settings_type', typeSelected.dataset.type)

                }
            })
        }  
    }
})

function adjustScreen() {
    if (window.matchMedia("(max-width:960px)").matches) {
        const rightZones = document.querySelectorAll("[data-id='11'], [data-id='23'], [data-id='35'], [data-id='47'], [data-id='59'], [data-id='71'], [data-id='83'], [data-id='95'], [data-id='107'], [data-id='119'], [data-id='131'], [data-id='143'], [data-id='12'], [data-id='24'], [data-id='36'], [data-id='48'], [data-id='60'], [data-id='72'], [data-id='84'], [data-id='96'], [data-id='108'], [data-id='120'], [data-id='132'], [data-id='144']")

        const bottomZones = document.querySelectorAll("[data-id='121'], [data-id='122'], [data-id='123'], [data-id='124'], [data-id='125'], [data-id='126'], [data-id='127'], [data-id='128'], [data-id='129'], [data-id='130'], [data-id='131'], [data-id='132'], [data-id='133'], [data-id='134'], [data-id='135'], [data-id='136'], [data-id='137'], [data-id='138'], [data-id='139'], [data-id='140'], [data-id='141'], [data-id='142'], [data-id='143'], [data-id='144']")
        
        rightZones.forEach(rightZone => {
            rightZone.classList.add('right')
        })

        bottomZones.forEach(bottomZone => {
            bottomZone.classList.add('bottom')
        })
        
        root.style.setProperty('--columns', 12)
        root.style.setProperty('--rows', 12)
    } else {
        const rightZones = document.querySelectorAll("[data-id='135'], [data-id='134'], [data-id='120'], [data-id='119'], [data-id='104'], [data-id='105'], [data-id='90'], [data-id='89'], [data-id='75'], [data-id='74'], [data-id='59'], [data-id='60'], [data-id='44'], [data-id='45'], [data-id='29'], [data-id='30'], [data-id='14'], [data-id='15']")

        const bottomZones = document.querySelectorAll("[data-id='135'], [data-id='134'], [data-id='133'], [data-id='132'], [data-id='131'], [data-id='130'], [data-id='129'], [data-id='128'], [data-id='127'], [data-id='126'], [data-id='125'], [data-id='124'], [data-id='123'], [data-id='122'], [data-id='121'], [data-id='120'], [data-id='119'], [data-id='118'], [data-id='117'], [data-id='116'], [data-id='115'], [data-id='114'], [data-id='113'], [data-id='112'], [data-id='111'], [data-id='110'], [data-id='109'], [data-id='108'], [data-id='107'], [data-id='106']")

        rightZones.forEach(rightZone => {
            rightZone.classList.add('right')
        })

        bottomZones.forEach(bottomZone => {
            bottomZone.classList.add('bottom')
        })

        root.style.setProperty('--columns', 15)
        root.style.setProperty('--rows', 9)
    }

}

window.addEventListener('resize', ()=> {
    const widgets = document.querySelectorAll('div.widget')
    
    refreshSizesDefault()

    const removeRights = document.querySelectorAll('.widget_dropzone')
    removeRights.forEach(removeRight => {
        removeRight.classList.remove('right')
        removeRight.classList.remove('bottom')
    })

    adjustScreen()
    createZones()
            
    widgets.forEach(widget => {
        if(widget.dataset.size == 'small') {
            widget.style.minWidth = `${smallSize.width}px`
            widget.style.minHeight = `${smallSize.height}px`  
            widget.style.maxWidth = `${smallSize.width}px`
            widget.style.maxHeight = `${smallSize.height}px`  
        } if (widget.dataset.size == 'medium') {
            widget.style.maxWidth = `none`
            widget.style.maxHeight = `none`
            widget.style.minWidth = `${mediumSize.width}px`
            widget.style.minHeight = `${mediumSize.height}px`
        } if (widget.dataset.size == 'large') {
            widget.style.maxWidth = `none`
            widget.style.maxHeight = `none`
            widget.style.minWidth = `${largeSize.width}px`
            widget.style.minHeight = `${largeSize.height}px`
        }
    })
})

closeEditWidget_modal.addEventListener('click', ()=> {
    closeModal(editWidget_modal)
})

document.addEventListener('dragover', (e) => e.preventDefault())



function saveSettings() {
    const colorSelected = document.querySelector('div.settigs_color_selected')
    const typeSelected = document.querySelector('.type_selected')
    const textColorSelected = document.querySelector('div.settigs_text_color_selected')
    const borderSelected = document.querySelector('div.border_selected')
    const widgets = document.querySelectorAll('.widget')

    widgets.forEach(widget => {
        widget.style.boxShadow = `3px 4px ${borderSelected.dataset.border}`
        localStorage.setItem('border', borderSelected.dataset.border)
        
        widget.style.color = textColorSelected.dataset.text_color
        localStorage.setItem('text_color', textColorSelected.dataset.text_color)
        
        if(typeSelected.dataset.type == 'square') {
            widget.style.borderRadius = 'var(--none-border-radius)'
            localStorage.setItem('settings_type', typeSelected.dataset.type)
        } if(typeSelected.dataset.type == 'small') {
            widget.style.borderRadius = 'var(--medium-border-radius)'
            localStorage.setItem('settings_type', typeSelected.dataset.type)
        } if(typeSelected.dataset.type == 'medium') {
            widget.style.borderRadius = 'var(--large-border-radius)'
            localStorage.setItem('settings_type', typeSelected.dataset.type)
        }       
    })
    const image = handleSettingsImage.dataset.image
    bgImage.style.backgroundImage = image
    bgImage.style.backgroundColor = colorSelected.dataset.color

    localStorage.setItem('backgroundColor', colorSelected.dataset.color)
    localStorage.setItem('backgroundImage', image)

    toast('Settings saved successfully!', 'green')
}

handleSettingsImage.addEventListener('change', function (e) {
    const inputTarget = e.target
    const file = inputTarget.files[0]
    const fileSize = inputTarget.files[0].size
    const reader = new FileReader()

    if(fileSize > (1024 * 1024 * 2)) {
        handleSettingsImage.value = ''
        toast('The selected file is more than 2mb! Please select a lighter file.', 'red')
        return
    } else {
        reader.addEventListener('load', function(e) {
            const readerTarget = e.target
            handleSettingsImage.dataset.image = `url(${readerTarget.result})` 
        })
    }
    reader.readAsDataURL(file)
})


function createWidget() {
    const colorSelected = document.querySelector('div.color_selected')
    const sizeSelected = document.querySelector('div.size_selected')
    const typeSelected = document.querySelector('div.type_selected')
    const linksExisting = document.querySelector("[data-link]")

    
    if(handleLink.value !== '' && colorSelected !== null && sizeSelected !== null) {
        if(linksExisting && handleLink.value == linksExisting.dataset.link) {
            toast('The link provided already exists in another Widget!', 'red')
            return
        }
        
        let widgets = new Array()
        const newWidget = document.createElement('div')
        const newWidget_a = document.createElement('a')
        const editWidget_btn = document.createElement('button')
        editWidget_btn.innerHTML = '<i class="fa-regular fa-pen-to-square fa-sm"></i>'
        addClass(editWidget_btn, 'editWidget')
        newWidget.draggable = true
        newWidget_a.dataset.link = handleLink.value
        newWidget.dataset.link = handleLink.value
        newWidget_a.setAttribute('href', handleLink.value)
        newWidget_a.setAttribute('target', '_blank')
        newWidget.style.backgroundColor = colorSelected.dataset.color
        newWidget.dataset.color = colorSelected.dataset.color
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

        refreshSizesDefault()

        if(sizeSelected.dataset.size == 'small') {
            newWidget.style.minWidth = `${smallSize.width}px`
            newWidget.style.minHeight = `${smallSize.height}px`
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

        if (typeSelected.dataset.type == 'square') {
            newWidget.style.borderRadius = 'var(--none-border-radius)'
            localStorage.setItem('settings_type', typeSelected.dataset.type)
        } if (typeSelected.dataset.type == 'small') {
            newWidget.style.borderRadius = 'var(--medium-border-radius)'
            localStorage.setItem('settings_type', typeSelected.dataset.type)
        } if (typeSelected.dataset.type == 'medium') {
            newWidget.style.borderRadius = 'var(--large-border-radius)'
            localStorage.setItem('settings_type', typeSelected.dataset.type)
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

        editWidget_btn.addEventListener('click', ()=> {
            addClass(newWidget, 'editing')
            const editedWidget = document.querySelector('div.editing')

            editWidget(editedWidget)
            editWidget_modal.dataset.id = editedWidget.dataset.id
        })
        
        const image = handleImage.dataset.image
        const imageSize = handleImage.dataset.image_size
        newWidget.style.backgroundImage = image
        newWidget.dataset.image = image
        
        
        newWidget.appendChild(newWidget_a)
        newWidget.appendChild(editWidget_btn)
        createZone.appendChild(newWidget)
        closeModal(newWidget_modal)
        cleanNewWidgetModal()
        removeClass(newWidget_btn, 'modal_openned')
        toast('Widget created successfully!', 'green')

    } else {
        toast('Fill in the fields correctly to create the Widget!', 'red')
        return
    }
}

function editWidget(widget){
    const handleEditColors = document.querySelectorAll('.edit_color_pick')
    const handleEditLink = document.getElementById('edit_link')
    const handleEditImage = document.getElementById('edit_image')
    const handleEditSizes = document.querySelectorAll('.edit_size_pick')
    const handleEditTitle = document.getElementById('edit_title') 
    const widgetEditLink = widget.querySelector('a')

    refreshSizesDefault()

    widget.classList.add('editing')

    handleEditLink.value = widget.dataset.link

    handleEditColors.forEach(handleEditColor => {
        handleEditColor.addEventListener('click', selectColor)
        handleEditColor.style.backgroundColor = handleEditColor.dataset.color
    })
    
    function selectColor() {
        handleEditColors.forEach(handleEditColor => {
            // removeClass(handleEditColor, 'color_selected')
            handleEditColor.classList.remove('color_selected')

        })
        // addClass(this, 'color_selected')
        this.classList.add('color_selected')
    }
    
    handleEditSizes.forEach(handleEditSize => {
        handleEditSize.addEventListener('click', selectSize)
    })
    
    function selectSize() {
        handleEditSizes.forEach(handleEditSize => {
            // removeClass(handleEditSize, 'size_selected')
            handleEditSize.classList.remove('size_selected')
        })
        this.classList.add('size_selected')

    }

    handleEditSizes.forEach(handleEditSize => {
        // removeClass(handleEditSize, 'size_selected')
        handleEditSize.classList.remove('size_selected')
    }) 
    
    if(widget.dataset.size === 'small'){
        const smallSize = editWidget_modal.querySelector("[data-size='small']")
        smallSize.classList.add('size_selected')
    } if(widget.dataset.size === 'medium'){
        const mediumSize = editWidget_modal.querySelector("[data-size='medium']")
        mediumSize.classList.add('size_selected')
    } if(widget.dataset.size === 'large'){
        const largeSize = editWidget_modal.querySelector("[data-size='large']")
        largeSize.classList.add('size_selected')
    } 

    if(widget.dataset.title) {
        handleEditTitle.value = widget.dataset.title
        widget.classList.add('has_title')
    } else {
        handleEditTitle.value = ''
    }

    const saveEditWidget = document.getElementById('edit_widget_btn')

    saveEditWidget.addEventListener('click', () => {
        const sizeSelected = editWidget_modal.querySelector('.size_selected')
        const colorSelected = editWidget_modal.querySelector('.color_selected')
        const editedWidget = document.querySelector('div.editing')
        const widgets = document.querySelectorAll('div.widget')
        
        widgets.forEach(widget => {
            if(editWidget_modal.dataset.id === widget.dataset.id){
                if(handleEditTitle.value !== ''){
                    widget.dataset.title = handleEditTitle.value
                    widget.classList.add('has_title')
                } else {
                    widget.dataset.title = ''
                }
                widget.dataset.link = handleEditLink.value
                widgetEditLink.setAttribute('href', handleEditLink.value)
            
                if(localStorage.hasOwnProperty('widgets')){
                    editableWidgets = JSON.parse(localStorage.getItem('widgets'))
                }

                widget.style.backgroundColor = colorSelected.dataset.color
                widget.dataset.color = colorSelected.dataset.color
                
                if(sizeSelected.dataset.size == 'small') {
                    widget.style.minWidth = `${smallSize.width}px`
                    widget.style.minHeight = `${smallSize.height}px`
                    widget.style.maxWidth = `${smallSize.width}px`
                    widget.style.maxHeight = `${smallSize.height}px`
                    widget.dataset.size = 'small'   
                } if (sizeSelected.dataset.size == 'medium') {
                    widget.style.maxWidth = `none`
                    widget.style.maxHeight = `none`
                    widget.style.minWidth = `${mediumSize.width}px`
                    widget.style.minHeight = `${mediumSize.height}px`
                    widget.dataset.size = 'medium'   
                } if (sizeSelected.dataset.size == 'large') {
                    widget.style.maxWidth = `none`
                    widget.style.maxHeight = `none`
                    widget.style.minWidth = `${largeSize.width}px`
                    widget.style.minHeight = `${largeSize.height}px`
                    widget.dataset.size = 'large'   
                }

                if(handleEditImage.value !== ''){
                    const image = handleEditImage.dataset.image
                    widget.style.backgroundImage = image
                    widget.dataset.image = image
                }
                handleEditImage.value = ''
                handleEditImage.dataset.image = ''
                
                for(i = 0; i < editableWidgets.length; i++) {
                    if(editableWidgets[i].widget_id == widget.dataset.id){
                        editableWidgets[i].widget_title = widget.dataset.title
                        editableWidgets[i].widget_size = widget.dataset.size
                        editableWidgets[i].widget_color = widget.dataset.color
                        editableWidgets[i].widget_link = widget.dataset.link
                        editableWidgets[i].widget_image = widget.dataset.image
                        localStorage.setItem('widgets', JSON.stringify(editableWidgets)) 
                    }
                }

                toast('Widget edited successfully!', 'green')
            }
        })
        widget.classList.remove('editing')
        editWidget_modal.dataset.id = '0'
        closeModal(editWidget_modal)
    })
    openModal(editWidget_modal)
}

function refreshID(){
    if(localStorage.hasOwnProperty('widgets')){
        widgets = JSON.parse(localStorage.getItem('widgets'))
    }
    
    const widgetDragged = document.querySelector('div.dragging')
    
    for(i = 0; i < widgets.length; i++) {
        if(widgets[i].widget_link == widgetDragged.dataset.link){
            widgets[i].widget_id = widgetDragged.dataset.id
            localStorage.setItem('widgets', JSON.stringify(widgets)) 
        }
    }
}

handleImage.addEventListener('change', function (e) {
    const inputTarget = e.target
    const file = inputTarget.files[0]
    const fileSize = inputTarget.files[0].size
    

    const reader = new FileReader()
    
    if(fileSize > (1024 * 1024)) {
        handleImage.value = ''
        toast('The selected file is more than 1mb! Please select a lighter file.', 'red')
        return
    } else {
        reader.addEventListener('load', function(e) {
            const readerTarget = e.target
            handleImage.dataset.image = `url(${readerTarget.result})` 
            handleImage.dataset.image_size = fileSize
        })
    }
    
    reader.readAsDataURL(file)
})

const handleEditImage = document.getElementById('edit_image')
handleEditImage.addEventListener('change', function (e) {
    const inputTarget = e.target
    const file = inputTarget.files[0]
    const fileSize = inputTarget.files[0].size


    const reader = new FileReader()

    if(fileSize > (1024 * 1024)) {
        handleEditImage.value = ''
        toast('The selected file is more than 1mb! Please select a lighter file.', 'red')
        return
    } else {
        reader.addEventListener('load', function(e) {
            const readerTarget = e.target
            handleEditImage.dataset.image = `url(${readerTarget.result})` 
        })
    }
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

    refreshSizesDefault()
 
}

function dragWidget(widget) {
    addClass(widget, 'dragging')
    closeSidebar()
}

handleBorders.forEach(handleBorder => {
    handleBorder.addEventListener('click', selectBorder)
    handleBorder.style.boxShadow = `2px 3px 0 ${handleBorder.dataset.border}`
})

function selectBorder() {
    handleBorders.forEach(handleBorder => {
        removeClass(handleBorder, 'border_selected')
    })
    addClass(this, 'border_selected')
}

handleTextColors.forEach(handleTextColor => {
    handleTextColor.addEventListener('click', selectTextColor)
    handleTextColor.style.backgroundColor = handleTextColor.dataset.text_color
})

function selectTextColor() {
    handleTextColors.forEach(handleTextColor => {
        removeClass(handleTextColor, 'settigs_text_color_selected')
    })
    addClass(this, 'settigs_text_color_selected')
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

deleteZone.addEventListener('dragover', () => {
    deleteZone.classList.add('delete_over')
})

deleteZone.addEventListener('dragleave', () => {
    deleteZone.classList.remove('delete_over')
})

deleteZone.addEventListener('drop', () => {
    const widgetDragged = document.querySelector('.dragging')
    const lastPosition = document.querySelector('div.last_position')

    if(localStorage.hasOwnProperty('widgets')){
        widgets = JSON.parse(localStorage.getItem('widgets'))
    }
    
    for(i = 0; i < widgets.length; i++) {
        if(widgets[i].widget_id == widgetDragged.dataset.id){
            widgets.splice(i, 1)

            localStorage.setItem('widgets', JSON.stringify(widgets)) 
        }
    }
    lastPosition.removeChild(widgetDragged)
    deleteZone.classList.remove('delete_over')
    toast('Widget deleted successfully!', 'green')    
})


function toast(message, color) {
    const toast = document.createElement('div')
    const toastMessage = document.createElement('p')
    const hasToast = document.querySelector('.toast_active')

    toast.classList.add('toast')
    

    toast.addEventListener('click', ()=> {
        toast.style.display = 'none'
    })

    if(hasToast) {
        bgImage.removeChild(hasToast)
        toast.classList.add('toast_active')
        toast.appendChild(toastMessage)
        bgImage.appendChild(toast)
    } else {
        toast.classList.add('toast_active')
        toast.appendChild(toastMessage)
        bgImage.appendChild(toast)
    }
    
    if (color == 'green') {
        toastMessage.innerHTML = `<i class="fa-regular fa-circle-check fa-lg"></i> ${message}`
        toast.style.boxShadow = '3px 3px 0 #50F296'
        toastMessage.style.color = '#50F296'
    } if (color == 'red') {
        toastMessage.innerHTML = `<i class="fa-solid fa-circle-exclamation fa-lg"></i> ${message}`
        toast.style.boxShadow = '3px 3px 0 #D92525'
        toastMessage.style.color = '#D92525'
    }

    if (toast.style.display !== 'none') {
        setTimeout(() => {
            toast.style.display = 'none'
        }, 6000)
    }
}
