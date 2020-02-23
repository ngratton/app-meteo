import template from '../utils/avecTemplateHtml.js'
import { http_get } from '../utils/request.js'

// 'https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}'
const API_URL = 'https://api.openweathermap.org/data/2.5/weather?q='
const API_KEY = '&appid=c50cab7593a8cc3197bc58b6e9199000'

export default Vue.component('meteo', template({
    template: 'components/meteo.html',
    
    data() {
        return {
            metrique: true,
            imperial: false,
            ville: this.$route.params.ville,
            pays: this.$route.params.pays,
            fuseauH: 0,
            fuseau: 0,
            temp_actuelle: 0,
            temp_ressentie: 0,
            vents: null,
            dir_vents: null,
            rafales: null,
            meteo: [],
            icone: '',
            neige: null,
            pluie: null,
            lever: null,
            coucher: null,
            heure_maint: null,
            date_ajd: null,
            objMeteo: null,
            resultat: true,
        }
    },

    mounted() {
        // Aquisition des données de météo avec le code de pays et nom de ville passé dans l'URL
        this.fetchMeteoVille(this.$route.params.pays, this.$route.params.ville)

        // Heure et journée actuelle
        this.heure_maint = this.heureNow()
        this.date_ajd = this.ajd()

        // Change la balise <title> de la page
        document.title = `Conditions actuelles pour ${this.$route.params.ville}, ${this.$route.params.pays} | Météo NG | Nicholas Gratton`
    },

    methods: {
        fetchMeteoVille(pays, ville) {
            // https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}&lang=fr
            http_get(`${API_URL}${ville},${pays}${API_KEY}&lang=fr`).then(data => {
                // Si la ville est trouvée, attribution des valeurs aux différents variables Vue
                if(data.cod != 404) {
                    this.objMeteo = data
                    // this.ville = data.name
                    // this.pays = data.sys.country
                    this.temp_actuelle = this.convertT(data.main.temp)
                    this.temp_ressentie = this.convertT(data.main.feels_like)
                    this.vents = this.convertSpeed(data.wind.speed)
                    this.rafales = this.convertSpeed(data.wind.gust)
                    this.dir_vents = this.directionVent(data.wind.deg)
                    this.meteo = data.weather[0]
                    this.fuseauH = data.timezone / 60 / 60
                    this.fuseau = data.timezone
                    this.neige = data.snow ? data.snow['1h'] : null
                    this.pluie = data.rain ? data.rain['1h'] : null
                    console.log(this.pluie)
                    this.humidite = data.main.humidity
                    this.lever = this.heure(data.sys.sunrise)
                    this.coucher = this.heure(data.sys.sunset)
                    this.icone = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
                } else {
                    // Sinon, redirection vers la page 404
                    this.$router.push('/404/')
                }
            })
        },

        // Toggle des unités de mesure
        toggleMetric() {
            this.metrique = !this.metrique
            this.imperial = !this.imperial
            this.convertUnit()
        },
        convertUnit() {
            this.temp_actuelle = this.convertT(this.objMeteo.main.temp)
            this.temp_ressentie = this.convertT(this.objMeteo.main.feels_like)
            this.vents = this.convertSpeed(this.objMeteo.wind.speed)
            this.rafales = this.convertSpeed(this.objMeteo.wind.gust)
        },

        // Conversion des mesures
        convertT(t) {
            if (this.metrique) {
                return Math.round(t - 273.15)
            } else {
                return Math.round((t - 273.15) * 1.8 + 32)
            }
        },
        convertSpeed(s) {
            if (this.metrique) {
                return Math.round(s * 3,6)
            } else {
                return Math.round(s * 2,237)
            }
        },
        convertPrec(m) {
            if (this.metrique) {
                let mM = this.neige ? mM * 100 : mM
                return mesure
            } else {
                return (mI / 25,4)
            }
        },

        // Gestion du temps
        heure(ts) {
            let t = (ts + this.fuseau) * 1000
            let time = new Date(t)
            let h = time.getUTCHours()
            let m = (time.getUTCMinutes()<10?'0':'') + time.getUTCMinutes()
            return `${h}h${m}`
        },
        heureNow() {
            let time = new Date()
            let h = time.getHours()
            let m = (time.getMinutes()<10?'0':'') + time.getMinutes()
            return `${h}h${m}`
        },
        ajd() {
            let ajd = new Date()
            let d = ajd.getDate()
            let m = ajd.getMonth()
            let mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'obtobre', 'novembre', 'décembre']
            let y = ajd.getFullYear()
            return `${d} ${mois[m]} ${y}`

        },

        // Conversion de la direction du vents de degrés à points cardinaux
        directionVent(deg) {
            let dir = Math.floor((deg / 45) + 0.5)
            let point = ['N','NE','E','SE','S','SO','O','NO',]
            return point[(dir % 8)]
          },
    }
}))