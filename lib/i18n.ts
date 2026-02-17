/**
 * Lightweight, project-wide i18n helper.
 * - Exposes a typed Locale
 * - Provides `t(key, locale, vars?)` for keyed translations with simple {var} interpolation
 * - Falls back to the default locale and the key itself when missing
 */

export type Locale = 'en' | 'fr'

export const supportedLocales: Locale[] = ['en', 'fr']

export const defaultLocale: Locale = 'fr'

type TranslationsMap = Record<string, string>

const translations: Record<Locale, TranslationsMap> = {
  fr: {
    // header
    'header.features': 'Fonctionnalités',
    'header.institutions': 'Institutions',
    'header.contact': 'Contact',
    'header.about': 'À propos',
    'header.signIn': 'Se connecter',
    'header.getStarted': "S'inscrire",
  'header.dashboard': 'Tableau de bord',
  'header.profile.profile': 'Profil',
  'header.profile.settings': 'Paramètres',
  'header.profile.logout': 'Se déconnecter',
  'header.signup.title': "S'inscrire",
  'header.signup.desc': 'Créez votre compte rapidement',
  'header.signup.fullName': 'Nom complet',
  'header.signup.email': 'Email',
  'header.signup.password': 'Mot de passe',
  'header.signup.cancel': 'Annuler',
  'header.signup.submit': 'Créer le compte',
  'header.signup.submitting': 'Création...',
  'header.login.title': 'Se connecter',
  'header.login.desc': 'Accédez à votre espace',
  'header.login.password': 'Mot de passe',
  'header.login.cancel': 'Annuler',
  'header.login.submit': 'Se connecter',
  'header.login.submitting': 'Connexion...',

  // hero
  'hero.badge': "Portail de signalement et d'accompagnement",
  'hero.title': 'Portail de signalement et d\'accompagnement sécurisé',
  'hero.subtitle': "Signalez le harcèlement en toute confidentialité et obtenez un accompagnement par des psychothérapeutes désignés par l'université.",
  'hero.description': "La plateforme WE4LEAD permet aux étudiant·e·s de l'Université de Sousse de signaler en toute sécurité des situations de harcèlement et de recevoir un soutien professionnel, un suivi et une orientation.",
  'hero.report': 'Signaler une situation',
  'hero.howItWorks': "Comment ça marche",
  'hero.card.confidential': 'Confidentiel',
  'hero.card.experts': 'Professionnels vérifiés',
  'hero.card.accessible': 'Suivi structuré',

    // cta
  'cta.title': 'Besoin de parler d\'une situation ?',
    'cta.description': "Vous pouvez déposer un signalement à tout moment. Un professionnel l'examinera et vous contactera.",
    'cta.getStarted': 'Commencer un signalement',
    'cta.learnMore': 'En savoir plus',

    // features
    'features.title': 'Pourquoi WE4LEAD',
    'features.description': "Une plateforme de confiance pour vous mettre en relation avec des professionnels de santé.",
    'features.smartDiscovery.title': 'Recherche intelligente',
    'features.smartDiscovery.description': 'Trouvez le bon médecin et l’institution adaptée grâce à des filtres avancés et des évaluations vérifiées.',
    'features.easyScheduling.title': 'Suivi structuré',
    'features.easyScheduling.description': "Chaque cas reçoit un accompagnement, une documentation et un suivi institutionnel.",
  'features.secure.title': 'Confidentialité et chiffrement',
  'features.secure.description': "Votre signalement est chiffré et accessible uniquement aux professionnels autorisés.",
  'features.verified.title': 'Psychothérapeutes vérifiés',
  'features.verified.description': "Tous les psychothérapeutes sont nommés et supervisés par l'université.",

  // institutions
    'institutions.hereForYou': 'Ici pour vous',
    'institutions.supportTitle': "Un accompagnement sur lequel vous pouvez compter",
    'institutions.supportDesc': "Nous mettons en relation les étudiant·e·s de l'Université de Sousse avec des médecins référencés pour chaque institut.",
    'institutions.institutionLabel': 'Institution',
    'institutions.doctorsCount': 'médecins',
    'institutions.showDoctors': 'Afficher les médecins',
    'institutions.book': 'Réserver',
    'institutions.noDoctorsTitle': 'Aucun médecin disponible pour le moment',
    'institutions.noDoctorsDesc': "Nous travaillons à référencer des médecins pour cet établissement — revenez bientôt.",

  // apropos (about)
  'apropos.badge': "Projet Erasmus+ WE4LEAD",
  'apropos.lead': "Cette plateforme s’inscrit dans le cadre du programme WE4LEAD, porté par l’Université de Sousse, visant à promouvoir l’égalité, la transparence et l’excellence dans l’enseignement supérieur.",
  'apropos.initiativeHeading': 'Une initiative académique structurante',
  'apropos.initiative.p1': "WE4LEAD (Women’s Empowerment For Leadership and Equity in Higher Education Institutions) est un projet Erasmus+ de renforcement des capacités dans l’enseignement supérieur.",
  'apropos.initiative.p2': "Il vise à analyser, accompagner et améliorer les pratiques institutionnelles en matière de gouvernance, de recrutement et de leadership.",
  'apropos.initiative.p3': "L’Université de Sousse participe activement à cette dynamique en intégrant ces principes dans ses politiques internes.",

  // key facts / counters
  'apropos.counters.countries': 'Pays partenaires',
  'apropos.counters.universities': 'Universités',
  'apropos.counters.beneficiaries': 'Bénéficiaires',
  'apropos.counters.statusTitle': 'En cours',
  'apropos.counters.statusDesc': 'Projet actif',

  // student section
  'apropos.students.heading': 'Un projet au service des étudiants',
  'apropos.students.p1': 'À travers WE4LEAD, les étudiants bénéficient d’un environnement académique plus transparent, plus équitable et plus respectueux des parcours individuels.',
  'apropos.students.p2': "Le projet favorise l’émergence de politiques institutionnelles garantissant l’égalité des chances dans l’accès aux postes de responsabilité et aux ressources.",
  'apropos.students.p3': 'Il contribue également à renforcer la confiance, le dialogue et la qualité de la vie universitaire.',

  // partners
  'apropos.partners.heading': 'Partenaires académiques',
  'apropos.partners.aix': 'Aix-Marseille Université (Coordinateur)',
  'apropos.partners.sapienza': 'Université La Sapienza de Rome',
  'apropos.partners.madrid': 'Université Autonoma de Madrid',
  'apropos.partners.sousse': 'Université de Sousse',
  'apropos.partners.tunis': 'Université Tunis El-Manar',
  'apropos.partners.lebanese': 'Université Libanaise',
  'apropos.partners.antonine': 'Université Antonine',

    // footer
    'footer.brand': 'WE4LEAD',
    'footer.university': "Université de Sousse",
  'footer.projectTitle': 'Projet',
  'footer.projectDesc': "Autonomisation des femmes pour le leadership et l'équité dans les établissements d'enseignement supérieur. Un projet Erasmus+ promouvant l'égalité des sexes dans les universités méditerranéennes.",
    'footer.context': 'Contexte',
    'footer.objectives': 'Objectifs',
    'footer.activities': 'Activités',
    'footer.partners': 'Partenaires',
    'footer.navigation': 'Navigation',
    'footer.home': 'Accueil',
    'footer.contact': 'Contact',
    'footer.addressLine1': 'Rue Khalifa El Karoui, Sahloul 4 – BP 526',
    'footer.email': 'Email: contact@uss.tn',
    'footer.phone': 'Tel: +216 73 366 700',
  'footer.copyright': '© {year} Projet WE4LEAD — Université de Sousse',
    'footer.coFunding': "Co‑financé par le programme Erasmus+ de l'Union européenne",
  // auth / modal
  'auth.success.title': 'Vérification par e-mail envoyée',
  'auth.success.checkInboxPrefix': 'Vérifiez votre boîte de réception à',
  'auth.success.desc': "Nous enverrons un lien de vérification. Cliquez dessus pour terminer votre inscription.",
  'auth.accountCreated': 'Compte créé',
  'auth.welcomeBack': 'Bienvenue',
  'auth.createAccount': 'Créez votre compte',
  'auth.login.desc': "Connectez-vous pour accéder à votre tableau de bord",
  'auth.signup.desc': "Rejoignez WE4LEAD et trouvez votre médecin idéal",
  'auth.fullName': 'Nom complet',
  'auth.emailAddress': 'Adresse e-mail',
  'auth.university': "Université / Institution",
  'auth.selectInstitution': "Sélectionnez votre établissement...",
  'auth.password': 'Mot de passe',
  'auth.forgotPassword': 'Mot de passe oublié?',
  'auth.rememberMe': "Se souvenir de moi",
  'auth.submit.signing': 'Connexion en cours...',
  'auth.submit.settingUp': "Création du compte...",
  'auth.button.signIn': '→ Se connecter',
  'auth.button.continue': '→ Continuer',
  'auth.noAccount': "Vous n'avez pas de compte?",
  'auth.alreadyAccount': 'Vous avez déjà un compte?',
  'auth.terms.prefix': "En vous connectant, vous acceptez nos",
  'auth.terms.termsLabel': 'Conditions',
  'auth.terms.privacyLabel': 'Politique de confidentialité',
  
  // psychotherapists / therapists cards
  'psychotherapists.specialties': 'Spécialités',
  'psychotherapists.availability': 'Disponibilité',
  'psychotherapists.locations': 'Établissements',
  'psychotherapists.contact': 'Contact',
  'psychotherapists.report.title': 'Signaler un cas',
  'psychotherapists.report.to': 'à {name}',
  'psychotherapists.report.nameLabel': 'Votre nom',
  'psychotherapists.report.placeholderName': 'Nom complet',
  'psychotherapists.report.emailLabel': 'Email',
  'psychotherapists.report.placeholderEmail': 'votre.email@example.com',
  'psychotherapists.report.phoneLabel': 'Téléphone',
  'psychotherapists.report.placeholderPhone': '+216 XX XXX XXX',
  'psychotherapists.report.descriptionLabel': 'Description du cas',
  'psychotherapists.report.descriptionPlaceholder': 'Décrivez brièvement la situation...',
  'psychotherapists.report.sending': 'Envoi en cours...',
  'psychotherapists.report.submit': 'Envoyer le rapport',
  'psychotherapists.report.button': 'Signaler un cas',
  'psychotherapists.report.ariaLabel': 'Signaler un cas à {name}',
  'psychotherapists.report.modalTitle': 'Signaler une situation',
  'psychotherapists.report.reassurance': 'Un professionnel vous répondra directement par email.',
  'psychotherapists.report.contactHeading': 'Vos coordonnées',
  'psychotherapists.report.contactReassurance': 'Ces informations sont uniquement utilisées par le professionnel pour vous répondre.',
  'psychotherapists.report.optional': 'optionnel',
  'psychotherapists.report.select': 'Sélectionner',
  'psychotherapists.report.situationHeading': 'Situation',
  'psychotherapists.report.typeLabel': 'Type de situation',
  'psychotherapists.report.periodLabel': 'Période',
  'psychotherapists.report.locationLabel': 'Lieu principal',
  'psychotherapists.report.statsHeading': 'Informations anonymisées pour statistiques (facultatif)',
  'psychotherapists.report.genderLabel': 'Genre',
  'psychotherapists.report.gender.female': 'Femme',
  'psychotherapists.report.gender.male': 'Homme',
  'psychotherapists.report.gender.other': 'Autre',
  'psychotherapists.report.studyLevelLabel': "Niveau d'étude",
  'psychotherapists.report.studyLevel.licence': 'Licence',
  'psychotherapists.report.studyLevel.master': 'Master',
  'psychotherapists.report.studyLevel.doctorate': 'Doctorat',
  'psychotherapists.report.studyLevel.other': 'Autre',
  'psychotherapists.report.descriptionHelper': "Décrivez librement la situation. Le professionnel vous contactera pour échanger avec vous.",
  'psychotherapists.report.consentText': "Je comprends que ce signalement permet un accompagnement et n'engage pas automatiquement une procédure disciplinaire.",
  'psychotherapists.report.cancel': 'Annuler',
  'psychotherapists.report.error.nameEmailRequired': "Le nom et l'email universitaire sont requis.",
  'psychotherapists.report.error.institutionRequired': "Veuillez sélectionner votre établissement.",
  'psychotherapists.report.error.situationTypeRequired': "Veuillez indiquer le type de situation.",
  'psychotherapists.report.error.periodRequired': "Veuillez indiquer la période.",
  'psychotherapists.report.error.descriptionRequired': "La description est requise.",
  'psychotherapists.report.error.genderRequired': "Veuillez indiquer votre genre (pour les statistiques).",
  'psychotherapists.report.error.studyLevelRequired': "Veuillez indiquer votre niveau d'étude (pour les statistiques).",
  'psychotherapists.report.error.consentRequired': "Le consentement est requis pour envoyer le signalement.",
  },

  en: {
    // header
    'header.features': 'Features',
    'header.institutions': 'Institutions',
    'header.contact': 'Contact',
    'header.about': 'About',
    'header.signIn': 'Sign in',
    'header.getStarted': 'Sign up',
  'header.profile.profile': 'Profile',
  'header.profile.settings': 'Settings',
  'header.profile.logout': 'Sign out',
  'header.dashboard': 'Dashboard',

  // hero
  'hero.badge': 'Safe Reporting & Support',
  'hero.title': 'Safe Reporting & Support Portal',
  'hero.subtitle': 'Report harassment confidentially and get guidance from university-assigned psychotherapists.',
  'hero.description': 'The WE4LEAD platform enables University of Sousse students to safely report harassment situations and receive professional support, follow-up, and orientation.',
  'hero.report': 'Report a situation',
  'hero.howItWorks': 'How it works',
  'hero.card.confidential': 'Confidential',
  'hero.card.experts': 'Verified professionals',
  'hero.card.accessible': 'Structured follow-up',

  // cta
  'cta.title': 'Need to talk about a situation?',
  'cta.description': 'You can start a report at any time. A professional will review it and contact you.',
  'cta.getStarted': 'Start a report',
  'cta.learnMore': 'Learn more',

    // features
    'features.title': 'Why WE4LEAD',
    'features.description': 'A trusted platform designed to connect you with healthcare professionals.',
  'features.smartDiscovery.title': 'Smart discovery',
  'features.smartDiscovery.description': 'Find the right doctor and institution with advanced filtering and verified patient ratings.',
  'features.easyScheduling.title': 'Structured follow-up',
  'features.easyScheduling.description': 'Each case receives guidance, documentation, and institutional follow-up.',
  'features.secure.title': 'Confidentiality & encryption',
  'features.secure.description': 'Your report is encrypted and accessible only to authorized professionals.',
  'features.verified.title': 'Verified psychotherapists',
  'features.verified.description': 'All psychotherapists are appointed and supervised by the university.',

    // institutions
    'institutions.hereForYou': 'Here for you',
    'institutions.supportTitle': 'Support you can rely on',
    'institutions.supportDesc': 'We connect University of Sousse students with trusted doctors assigned to each institute.',
    'institutions.institutionLabel': 'Institution',
    'institutions.doctorsCount': 'doctors',
    'institutions.showDoctors': 'Show doctors',
    'institutions.book': 'Book',
    'institutions.noDoctorsTitle': 'No doctors available yet',
    'institutions.noDoctorsDesc': "We're working on adding doctors for this institution — check back soon.",

  // apropos (about)
  'apropos.badge': 'WE4LEAD Erasmus+ Project',
  'apropos.lead': "This platform is part of the WE4LEAD programme, led by the University of Sousse, aiming to promote equality, transparency and excellence in higher education.",
  'apropos.initiativeHeading': 'A structuring academic initiative',
  'apropos.initiative.p1': "WE4LEAD (Women’s Empowerment For Leadership and Equity in Higher Education Institutions) is an Erasmus+ capacity-building project in higher education.",
  'apropos.initiative.p2': 'It aims to analyse, support and improve institutional practices in governance, recruitment and leadership.',
  'apropos.initiative.p3': 'The University of Sousse actively participates in this initiative by integrating these principles into its internal policies.',

  // key facts / counters
  'apropos.counters.countries': 'Partner countries',
  'apropos.counters.universities': 'Universities',
  'apropos.counters.beneficiaries': 'Beneficiaries',
  'apropos.counters.statusTitle': 'Ongoing',
  'apropos.counters.statusDesc': 'Active project',

  // student section
  'apropos.students.heading': 'A project serving students',
  'apropos.students.p1': 'Through WE4LEAD, students benefit from a more transparent, fairer academic environment that respects individual pathways.',
  'apropos.students.p2': 'The project promotes the development of institutional policies that ensure equal opportunities in access to leadership positions and resources.',
  'apropos.students.p3': 'It also helps strengthen trust, dialogue and overall quality of university life.',

  // partners
  'apropos.partners.heading': 'Academic partners',
  'apropos.partners.aix': 'Aix-Marseille University (Coordinator)',
  'apropos.partners.sapienza': 'Sapienza University of Rome',
  'apropos.partners.madrid': 'Autonomous University of Madrid',
  'apropos.partners.sousse': 'University of Sousse',
  'apropos.partners.tunis': 'University of Tunis El-Manar',
  'apropos.partners.lebanese': 'Lebanese University',
  'apropos.partners.antonine': 'Antonine University',

    // footer
    'footer.brand': 'WE4LEAD',
    'footer.university': 'University of Sousse',
  'footer.projectTitle': 'Project',
  'footer.projectDesc': "Women’s Empowerment for Leadership and Equity in Higher Education Institutions. An Erasmus+ project promoting gender equality in Mediterranean universities.",
    'footer.context': 'Context',
    'footer.objectives': 'Objectives',
    'footer.activities': 'Activities',
    'footer.partners': 'Partners',
    'footer.navigation': 'Navigation',
    'footer.home': 'Home',
    'footer.contact': 'Contact',
    'footer.addressLine1': 'Rue Khalifa El Karoui, Sahloul 4 – BP 526',
    'footer.email': 'Email: contact@uss.tn',
    'footer.phone': 'Tel: +216 73 366 700',
  'footer.copyright': '© {year} WE4LEAD Project — University of Sousse',
    'footer.coFunding': 'Co‑funded by the Erasmus+ Programme of the European Union',
  // auth / modal
  'auth.success.title': 'Verification email sent',
  'auth.success.checkInboxPrefix': 'Check your inbox at',
  'auth.success.desc': 'We will send a verification link. Click it to complete your registration.',
  'auth.accountCreated': 'Account Created',
  'auth.welcomeBack': 'Welcome Back',
  'auth.createAccount': 'Create Your Account',
  'auth.login.desc': 'Sign in to access your dashboard',
  'auth.signup.desc': 'Join WE4LEAD and find your ideal doctor',
  'auth.fullName': 'Full Name',
  'auth.emailAddress': 'Email Address',
  'auth.university': 'University / Institution',
  'auth.selectInstitution': 'Select your institution...',
  'auth.password': 'Password',
  'auth.forgotPassword': 'Forgot password?',
  'auth.rememberMe': 'Remember me',
  'auth.submit.signing': 'Signing In...',
  'auth.submit.settingUp': 'Setting Up Account...',
  'auth.button.signIn': '→ Sign In',
  'auth.button.continue': '→ Continue',
  'auth.noAccount': "Don't have an account?",
  'auth.alreadyAccount': 'Already have an account?',
  'auth.terms.prefix': 'By signing in, you agree to our',
  'auth.terms.termsLabel': 'Terms',
  'auth.terms.privacyLabel': 'Privacy Policy',
  
  // psychotherapists / therapists cards
  'psychotherapists.specialties': 'Specialties',
  'psychotherapists.availability': 'Availability',
  'psychotherapists.locations': 'Institutions',
  'psychotherapists.contact': 'Contact',
  'psychotherapists.report.title': 'Report a case',
  'psychotherapists.report.to': 'to {name}',
  'psychotherapists.report.nameLabel': 'Your name',
  'psychotherapists.report.placeholderName': 'Full name',
  'psychotherapists.report.emailLabel': 'Email',
  'psychotherapists.report.placeholderEmail': 'your.email@example.com',
  'psychotherapists.report.phoneLabel': 'Phone',
  'psychotherapists.report.placeholderPhone': '+216 XX XXX XXX',
  'psychotherapists.report.descriptionLabel': 'Case description',
  'psychotherapists.report.descriptionPlaceholder': 'Briefly describe the situation...',
  'psychotherapists.report.sending': 'Sending...',
  'psychotherapists.report.submit': 'Send report',
  'psychotherapists.report.button': 'Report a case',
  'psychotherapists.report.ariaLabel': 'Report a case to {name}',
  'psychotherapists.report.modalTitle': 'Report a situation',
  'psychotherapists.report.reassurance': 'A professional will reply to you directly by email.',
  'psychotherapists.report.contactHeading': 'Your contact details',
  'psychotherapists.report.contactReassurance': 'This information is used only by the professional to reply to you.',
  'psychotherapists.report.optional': 'optional',
  'psychotherapists.report.select': 'Select',
  'psychotherapists.report.situationHeading': 'Situation',
  'psychotherapists.report.typeLabel': 'Type of situation',
  'psychotherapists.report.periodLabel': 'Period',
  'psychotherapists.report.locationLabel': 'Main location',
  'psychotherapists.report.statsHeading': 'Anonymous information for statistics (optional)',
  'psychotherapists.report.genderLabel': 'Gender',
  'psychotherapists.report.gender.female': 'Female',
  'psychotherapists.report.gender.male': 'Male',
  'psychotherapists.report.gender.other': 'Other',
  'psychotherapists.report.studyLevelLabel': 'Study level',
  'psychotherapists.report.studyLevel.licence': "Bachelor's",
  'psychotherapists.report.studyLevel.master': "Master's",
  'psychotherapists.report.studyLevel.doctorate': 'Doctorate',
  'psychotherapists.report.studyLevel.other': 'Other',
  'psychotherapists.report.descriptionHelper': 'Describe the situation freely. The professional will contact you to discuss it.',
  'psychotherapists.report.consentText': 'I understand this report allows support and does not automatically trigger disciplinary proceedings.',
  'psychotherapists.report.cancel': 'Cancel',
  'psychotherapists.report.error.nameEmailRequired': 'Name and university email are required.',
  'psychotherapists.report.error.institutionRequired': 'Please select your institution.',
  'psychotherapists.report.error.situationTypeRequired': 'Please indicate the type of situation.',
  'psychotherapists.report.error.periodRequired': 'Please indicate the period.',
  'psychotherapists.report.error.descriptionRequired': 'Description is required.',
  'psychotherapists.report.error.genderRequired': 'Please indicate your gender (for statistics).',
  'psychotherapists.report.error.studyLevelRequired': 'Please indicate your study level (for statistics).',
  'psychotherapists.report.error.consentRequired': 'Consent is required to send the report.',
  },
}

/**
 * Simple variable interpolation replacement: replaces {var} in text with vars[var]
 */
function interpolate(text: string, vars?: Record<string, string | number>) {
  if (!vars) return text
  return text.replace(/\{(\w+)\}/g, (_m, p1) => {
    const v = vars[p1]
    return v === undefined || v === null ? '' : String(v)
  })
}

/**
 * Retrieve a translation for a key. If missing in the chosen locale, it falls back to the default.
 * @param key translation key, e.g. 'hero.title'
 * @param locale optional locale, defaults to defaultLocale
 * @param vars optional variables for interpolation
 */
export function t(key: string, locale?: Locale, vars?: Record<string, string | number>) {
  const loc = locale && supportedLocales.includes(locale) ? locale : defaultLocale
  const msg = translations[loc]?.[key] ?? translations[defaultLocale]?.[key] ?? key
  return interpolate(msg, vars)
}

const i18n = {
  t,
  supportedLocales,
  defaultLocale,
}

export default i18n
