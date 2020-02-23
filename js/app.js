import router from './router.js'

new Vue({
    el: '#app',
    router,
    data: {
        ville: 'Blainville',
    },
    watch: {
        '$route': {
            handler: (to, from) => {
                document.title = to.meta.title || 'Météo | Nicholas Gratton'
            },
            immediate: true
        }
    }
})