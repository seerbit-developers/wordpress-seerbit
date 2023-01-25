const Calendar = {
    sunday: 'dim',
    monday: 'lu',
    tuesday: 'ma',
    wednesday: 'me',
    thursday: 'je',
    friday: 've',
    saturday: 'sa',
    ok: 'LEK',
    today: 'Aujourd\'hui',
    yesterday: 'Yier',
    hours: 'Heures',
    minutes: 'Minutes',
    seconds: 'Seconds',
    /**
     * Format of the string is based on Unicode Technical Standard #35:
     * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
     **/
    formattedMonthPattern: 'MMM yyyy',
    formattedDayPattern: 'DD MMM yyyy'
};

export default {
    Pagination: {
        more: 'Suite',
        prev: 'Précédent',
        next: 'Suivant',
        first: 'D\'abord',
        last: 'Dernier'
    },
    Table: {
        emptyMessage: 'Aucune donnée disponible',
        loading: 'Chargement...'
    },
    TablePagination: {
        lengthMenuInfo: '{0} / page',
        totalInfo: 'Le total: {0}'
    },
    Calendar,
    DatePicker: {
        ...Calendar
    },
    DateRangePicker: {
        ...Calendar,
        last7Days: '7 derniers jours'
    },
    Picker: {
        noResultsText: 'Aucun résultat trouvé',
        placeholder: 'Sélectionner',
        searchPlaceholder: 'Chercher',
        checkAll: 'Tout'
    },
    InputPicker: {
        newItem: 'Nouvel article',
        createOption: 'Créer une option "{0}"'
    },
    Uploader: {
        inited: 'Initiale',
        progress: 'Téléchargement',
        error: 'Erreur',
        complete: 'Fini',
        emptyFile: 'Vide',
        upload: 'Télécharger'
    }
};
