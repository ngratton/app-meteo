import searchcity from './components/searchcity.js'
import meteo from './components/meteo.js'
import err404 from './components/err404.js'

export default new VueRouter({
    routes: [
        { 
            path: '/',
            name: 'accueil',
            component: searchcity,
        },
        { 
            path: '/meteo/:pays/:ville/',
            name: 'meteo',
            component: meteo,
        },
        {
            path: '/404/',
            name: 'err404',
            component: err404,
        }
    ],
})