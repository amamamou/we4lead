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
    'hero.badge': 'Portail de consultation universitaire',
    'hero.title': 'Votre bien‑être, notre priorité',
    'hero.description': "Accédez facilement à des consultations psychologiques gratuites et confidentielles. Le projet WE4LEAD soutient la santé mentale des étudiant·e·s de l'Université de Sousse.",
    'hero.findConsultant': 'Trouver un consultant',
    'hero.learnMore': 'En savoir plus',
    'hero.card.confidential': '100% confidentiel',
    'hero.card.experts': 'Experts qualifiés',
    'hero.card.accessible': 'Accessible partout',

    // cta
  'cta.title': 'Besoin d’aide ?',
    'cta.description': 'Les médecins de votre établissement sont à portée de clic.',
    'cta.getStarted': 'Commencer',
    'cta.learnMore': 'En savoir plus',

    // features
    'features.title': 'Pourquoi WE4LEAD',
    'features.description': "Une plateforme de confiance pour vous mettre en relation avec des professionnels de santé.",
    'features.smartDiscovery.title': 'Recherche intelligente',
    'features.smartDiscovery.description': 'Trouvez le bon médecin et l’institution adaptée grâce à des filtres avancés et des évaluations vérifiées.',
    'features.easyScheduling.title': 'Prise de rendez‑vous simple',
    'features.easyScheduling.description': 'Réservez instantanément avec disponibilité en temps réel et confirmations automatiques.',
  'features.secure.title': 'Plateforme sécurisée',
  'features.secure.description': "Vos informations médicales sont protégées par des mesures de sécurité de niveau professionnel.",
  'features.verified.title': 'Professionnels vérifiés',
  'features.verified.description': "Tous les médecins et établissements sont vérifiés et respectent des standards professionnels élevés.",

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
    'hero.badge': 'University Consultation Portal',
    'hero.title': 'Your wellbeing, our priority',
    'hero.description': "Easily access free and confidential psychological consultations. The WE4LEAD project supports the mental health of University of Sousse students.",
    'hero.findConsultant': 'Find a consultant',
    'hero.learnMore': 'Learn more',
    'hero.card.confidential': '100% Confidential',
    'hero.card.experts': 'Qualified experts',
    'hero.card.accessible': 'Accessible anywhere',

    // cta
    'cta.title': 'Looking for support?',
    'cta.description': "Your institute's doctors are just a few clicks away.",
    'cta.getStarted': 'Get started',
    'cta.learnMore': 'Learn more',

    // features
    'features.title': 'Why WE4LEAD',
    'features.description': 'A trusted platform designed to connect you with healthcare professionals.',
    'features.smartDiscovery.title': 'Smart discovery',
    'features.smartDiscovery.description': 'Find the right doctor and institution with advanced filtering and verified patient ratings.',
    'features.easyScheduling.title': 'Easy scheduling',
    'features.easyScheduling.description': 'Book appointments instantly with real‑time availability and automatic confirmations.',

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
