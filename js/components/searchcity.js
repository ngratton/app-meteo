import template from '../utils/avecTemplateHtml.js'

export default Vue.component('searchcity', template({
    template: 'components/searchcity.html',
    data() {
        return {
            ville: '',
            pays: '',
        }
    },
    mounted() {
        var placesAutocomplete = places({
            appId: 'pl635MZSVCN7',
            apiKey: '1dbed780ada60ec737fcecf65e034628',
            container: document.querySelector('#city-input'),
            type: 'city',
          })
        placesAutocomplete.on('change', e => {
            this.ville = e.suggestion.name
            this.pays = e.suggestion.countryCode.toUpperCase(e.suggestion.countryCode)
        })
        document.title = `Météo NG | Nicholas Gratton`
    },
    methods: {
        envoyerVille() {
            if(this.pays == '' || this.ville == '') {
                this.$router.push({ path: '/404/' })
            } else {
                this.$router.push({ path: `/meteo/${this.pays}/${this.ville}` })
            }
        },

    }
}))