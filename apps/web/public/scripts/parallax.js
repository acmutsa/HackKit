document.addEventListener('DOMContentLoaded', () => {
    const parallaxLayers = document.querySelectorAll('.parallax-layer')

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop

        parallaxLayers.forEach((layer) => {
            let depth = layer.getAttribute('data-depth')
            if (!depth) return
            let movement = scrollTop * parseFloat(depth)
            let translate3d = `translate3d(0, ${movement}px, 0)`
                ; layer.style.transform = translate3d
        })
    })
})