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
  'header.features': 'Accueil',
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
  'hero.badge': "Cellule WE4LEAD • Université de Sousse",
  'hero.title': "Signalement sécurisé & accompagnement professionnel",
  'hero.subtitle': "Une plateforme confidentielle pour signaler le harcèlement et bénéficier d’un accompagnement psychologique encadré par l’Université de Sousse.",
  'hero.description': "La Cellule WE4LEAD permet aux membres de la communauté universitaire de signaler en toute sécurité des situations de harcèlement, de discrimination ou d’inconduite et de bénéficier d’un suivi institutionnel structuré.",
  'hero.report': "Signaler une situation",
  'hero.howItWorks': 'En savoir plus',
  'hero.card.confidential': "Confidentialité garantie",
  'hero.card.experts': "Professionnels désignés",
  'hero.card.accessible': "Suivi structuré",

    // cta
  'cta.title': 'Besoin de parler d\'une situation ?',
    'cta.description': "Vous pouvez déposer un signalement à tout moment. Il sera examiné par un professionnel qui vous contactera directement.",
    'cta.getStarted': 'Commencer un signalement',
    'cta.learnMore': 'En savoir plus',

      // guided report / reporting section
      'guidedReport.title': 'Reporter un cas',
      'guidedReport.subtitle': 'Un processus simple et confidentiel',
      'guidedReport.description': "Notre service vous permet de signaler un cas de façon totalement confidentielle à nos psychologues certifiées. La procédure est sécurisée, discrète et adaptée à vos besoins.",
      'guidedReport.feature1': 'Formulaire rapide et sécurisé (sans divulgation publique)',
      'guidedReport.feature2': 'Réponse sous 24–48 heures pour un suivi personnalisé',
  'guidedReport.feature3': "Consultations confidentielles à l'université si nécessaire",
  'guidedReport.cta': 'Commencer maintenant',
  // local guided report extras used by GuidedReportSection
  'guidedReport.safeProcess.title': 'Un processus sûr et bienveillant',
  'guidedReport.safeProcess.desc': "Nous veillons à ce que chaque signalement soit traité avec professionnalisme, respect et accompagnement structuré.",
  // steps
  'guidedReport.step1.title': 'Signaler un cas',
  'guidedReport.step1.description': "Remplissez notre formulaire sécurisé avec les détails de votre situation de manière entièrement confidentielle.",
  'guidedReport.step2.title': 'Être contacté',
  'guidedReport.step2.description': "Notre équipe examinera votre cas et vous contactera dans un délai de 24-48 heures pour confirmer un rendez-vous.",
  'guidedReport.step3.title': "Rencontre à l'université",
  'guidedReport.step3.description': "Rencontrez votre psychologue à l'Université de Sousse pour une première consultation confidentielle et professionnelle.",

    // features
    'features.title': 'Pourquoi WE4LEAD',
    'features.description': "Une plateforme de confiance pour vous mettre en relation avec des professionnels de santé.",
    'features.smartDiscovery.title': 'Recherche intelligente',
    'features.smartDiscovery.description': 'Trouvez le bon médecin et l’institution adaptée grâce à des filtres avancés et des évaluations vérifiées.',
    'features.easyScheduling.title': 'Accompagnement accessible',
    'features.easyScheduling.description': "Effectuez un signalement à tout moment et bénéficiez d’un suivi personnalisé.",
  'features.secure.title': 'Confidentialité et chiffrement',
  'features.secure.description': "Chaque signalement est transmis de manière sécurisée et accessible uniquement aux professionnels habilités.",
  'features.verified.title': 'Professionnels désignés',
  'features.verified.description': "Les psychothérapeutes sont officiellement désignés et encadrés par l’Université de Sousse.",

  // WE4LEAD Cellule / harassment response section
  'cellule.sectionTitle': 'Une réponse institutionnelle et sécurisée au harcèlement',
  'cellule.sectionDesc': "La Cellule WE4LEAD propose un signalement confidentiel et un accompagnement psychologique professionnel au sein de l'Université de Sousse.",

  'cellule.features.1.title': 'Signalement confidentiel du harcèlement',
  'cellule.features.1.description': 'Signalez en toute sécurité le harcèlement ou les comportements inappropriés via la plateforme sécurisée de la Cellule WE4LEAD.',

  'cellule.features.2.title': "Unité d'accompagnement WE4LEAD",
  'cellule.features.2.description': 'La Cellule WE4LEAD agit comme une unité institutionnelle dédiée assurant un suivi structuré et responsable.',

  'cellule.features.3.title': 'Contact professionnel direct',
  'cellule.features.3.description': "Le psychothérapeute référent vous contacte directement par email afin d’assurer un accompagnement personnalisé.",

  'cellule.features.4.title': "Aide sur le campus",
  'cellule.features.4.description': "Des rencontres confidentielles sont organisées à l'Université de Sousse dans un environnement sécurisé.",

  'cellule.features.5.title': 'Confidentialité stricte',
  'cellule.features.5.description': "Tous les signalements sont traités avec la plus stricte confidentialité, conformément aux normes éthiques et institutionnelles de l’Université de Sousse.",

  'cellule.features.6.title': "Promotion de l'égalité de genre",
  'cellule.features.6.description': "Intégrée au projet Erasmus+ WE4LEAD pour renforcer une gouvernance universitaire sûre et équitable.",

  // cellule - additional keys used by BentoGrid
  'cellule.stats.institutes': 'Instituts',
  'cellule.stats.confidentiality': 'Confidentialité',
  'cellule.stats.assignedProfessional': 'Professionnel désigné',
  'cellule.stats.steps': 'Étapes du processus',

  'cellule.quickAccess.title': 'Accès rapide au signalement',
  'cellule.quickAccess.desc': 'Accédez à tout moment au formulaire de signalement confidentiel et sécurisé.',

  'cellule.structuredWorkflow.title': 'Processus structuré de traitement des dossiers',
  'cellule.structuredWorkflow.desc': 'Signalez en toute sécurité. Recevez un accompagnement. Bénéficiez d’un soutien.',

  'cellule.firstContactLabel': 'Premier contact',

  'cellule.security.title': 'Conformité éthique et juridique',
  'cellule.security.desc': "Gestion conforme aux réglementations universitaires et aux normes internationales.",

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

  // landing / partners section
  'partners.heading': 'Nos Partenaires',
  'partners.fundedBy': 'Financé par',
  'partners.eu.alt': "Drapeau de l'Union européenne",
  'partners.eu.label': "Union européenne",

    // footer
    'footer.brand': 'WE4LEAD',
    'footer.university': "Université de Sousse",
  'footer.projectTitle': 'Projet',
  'footer.projectDesc': "Autonomisation des femmes pour le leadership et l'équité dans les établissements d'enseignement supérieur. Un projet Erasmus+ promouvant l'égalité de genre dans les universités méditerranéennes.",
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
  'psychotherapists.heading': 'Nos psychothérapeutes',
  // shortened French subtitle (shown only for fr locale)
  'psychotherapists.subtitle': 'Recherchez le professionnel référent de votre institut.',
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
  'psychotherapists.report.placeholderPhone': 'XX XXX XXX',
  'psychotherapists.report.descriptionLabel': 'Description du cas',
  'psychotherapists.report.descriptionPlaceholder': 'Décrivez brièvement la situation...',
  'psychotherapists.report.sending': 'Envoi en cours...',
  'psychotherapists.report.submit': 'Envoyer le rapport',
  'psychotherapists.report.button': 'Signaler un cas',
  'psychotherapists.report.ariaLabel': 'Signaler un cas à {name}',
  'psychotherapists.report.modalTitle': 'Signaler une situation',
  'psychotherapists.report.reassurance': 'Vous recevrez une réponse directe par e-mail.',
  'psychotherapists.report.contactHeading': 'Vos coordonnées',
  'psychotherapists.report.contactReassurance': 'Ces informations sont uniquement utilisées par le professionnel pour vous répondre.',
  'psychotherapists.report.optional': 'optionnel',
  'psychotherapists.report.select': 'Sélectionner',
  'psychotherapists.report.situationHeading': 'Situation',
  'psychotherapists.report.typeLabel': 'Type de situation',
  'psychotherapists.report.periodLabel': 'Période',
  'psychotherapists.report.locationLabel': 'Lieu principal',
  'psychotherapists.report.statsHeading': '',
  'psychotherapists.report.genderLabel': 'Genre',
  'psychotherapists.report.gender.female': 'Femme',
  'psychotherapists.report.gender.male': 'Homme',
  'psychotherapists.report.gender.other': 'Autre',
  'psychotherapists.report.studyLevelLabel': "Niveau d'étude",
  'psychotherapists.report.studyLevel.licence': 'Licence',
  'psychotherapists.report.studyLevel.master': 'Master',
  'psychotherapists.report.studyLevel.doctorate': 'Doctorat',
  'psychotherapists.report.studyLevel.other': 'Autre',
  'psychotherapists.report.descriptionHelper': "Décrivez librement la situation. Vous serez contacté·e pour en discuter.",
  'psychotherapists.report.consentText': 'Je confirme la soumission de ce signalement.',
  'psychotherapists.report.cancel': 'Annuler',
  'psychotherapists.report.error.nameEmailRequired': "Le nom et l'email universitaire sont requis.",
  'psychotherapists.report.error.institutionRequired': "Veuillez sélectionner votre établissement.",
  'psychotherapists.report.error.situationTypeRequired': "Veuillez indiquer le type de situation.",
  'psychotherapists.report.error.periodRequired': "Veuillez indiquer la période.",
  'psychotherapists.report.error.descriptionRequired': "La description est requise.",
  'psychotherapists.report.error.genderRequired': "Veuillez indiquer votre genre (pour les statistiques).",
  'psychotherapists.report.error.studyLevelRequired': "Veuillez indiquer votre niveau d'étude (pour les statistiques).",
  'psychotherapists.report.error.consentRequired': "Le consentement est requis pour envoyer le signalement.",
  'psychotherapists.report.error.endBeforeStart': "La date de fin doit être postérieure à la date de début.",
  'psychotherapists.report.error.sendFailed': "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
  // success messages for report submission (fr)
  'psychotherapists.report.successTitle': 'Signalement envoyé',
  'psychotherapists.report.successMessage': 'Votre signalement a bien été envoyé. Veuillez vérifier votre boîte de réception — vous serez bientôt contacté·e. Si vous ne voyez pas l\'email, vérifiez votre dossier spam.',
  },

  en: {
  // header
  'header.features': 'Home',
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
  'hero.badge': 'WE4LEAD Support Unit • University of Sousse',
  'hero.title': 'Safe Reporting & Professional Support',
  'hero.subtitle': 'A confidential platform to report harassment and receive professional psychological guidance.',
  'hero.description': 'The WE4LEAD Cellule enables members of the University of Sousse community to safely report harassment, discrimination, or misconduct and receive structured institutional support.',
  'hero.report': 'Report a Situation',
  'hero.howItWorks': 'Learn more',
  'hero.card.confidential': 'Guaranteed Confidentiality',
  'hero.card.experts': 'University-Appointed Professionals',
  'hero.card.accessible': 'Accessible & Structured Support',

  // cta
  'cta.title': 'Need to talk about a situation?',
  'cta.description': 'You can start a report at any time. A professional will review it and contact you.',
  'cta.getStarted': 'Start a report',
  'cta.learnMore': 'Learn more',

    // guided report / reporting section
    'guidedReport.title': 'Report a situation',
    'guidedReport.subtitle': 'A simple, confidential process',
    'guidedReport.description': 'Our service lets you report a situation confidentially to our certified psychotherapists. The procedure is secure, discreet and tailored to your needs.',
    'guidedReport.feature1': 'Quick secure form (no public disclosure)',
    'guidedReport.feature2': 'Response within 24–48 hours for personalised follow-up',
    'guidedReport.feature3': 'Confidential consultations at the university if needed',
  'guidedReport.cta': 'Get started',
  // local guided report extras used by GuidedReportSection
  'guidedReport.safeProcess.title': 'A safe & supportive process',
  'guidedReport.safeProcess.desc': 'We ensure every report is handled with professionalism, respect, and structured guidance.',
  // steps
  'guidedReport.step1.title': 'Report a situation',
  'guidedReport.step1.description': 'Fill our secure form with the details of your situation in complete confidentiality.',
  'guidedReport.step2.title': 'Be contacted',
  'guidedReport.step2.description': 'Our team will review your case and reach out within 24-48 hours to confirm an appointment.',
  'guidedReport.step3.title': 'On-campus meeting',
  'guidedReport.step3.description': 'Meet your psychotherapist at the University of Sousse for an initial confidential and professional consultation.',

    // features
    'features.title': 'Why WE4LEAD',
    'features.description': 'A trusted platform designed to connect you with healthcare professionals.',
  'features.smartDiscovery.title': 'Smart discovery',
  'features.smartDiscovery.description': 'Find the right doctor and institution with advanced filtering and verified patient ratings.',
  'features.easyScheduling.title': 'Accessible & Structured Support',
  'features.easyScheduling.description': 'Submit a report at any time and receive structured follow-up from a dedicated professional.',
  'features.secure.title': 'Confidentiality & encryption',
  'features.secure.description': 'All reports are securely transmitted and accessible only to authorized professionals.',
  'features.verified.title': 'University-Appointed Professionals',
  'features.verified.description': 'Psychotherapists are officially designated and supervised by the University of Sousse.',

  // WE4LEAD Cellule / harassment response section
  'cellule.sectionTitle': 'A Safe & Institutional Response to Harassment',
  'cellule.sectionDesc': 'The WE4LEAD Cellule provides confidential reporting and professional psychological support within the University of Sousse.',

  'cellule.features.1.title': 'Confidential Harassment Reporting',
  'cellule.features.1.description': 'Safely report harassment or gender-based misconduct through the secure WE4LEAD Cellule platform.',

  'cellule.features.2.title': 'WE4LEAD Support Unit',
  'cellule.features.2.description': 'The WE4LEAD Cellule acts as a dedicated institutional unit ensuring structured and responsible follow-up.',

  'cellule.features.3.title': 'Direct Professional Follow-Up',
  'cellule.features.3.description': 'The assigned licensed psychotherapist contacts you directly by email to provide guidance and arrange support.',

  'cellule.features.4.title': 'On-Campus Assistance',
  'cellule.features.4.description': 'Confidential meetings are organized within the University of Sousse in a secure environment.',

  'cellule.features.5.title': 'Strict Confidentiality',
  'cellule.features.5.description': 'All reports are handled with discretion in line with university ethical and privacy standards.',

  'cellule.features.6.title': 'Advancing Gender Equity',
  'cellule.features.6.description': 'Integrated within the Erasmus+ WE4LEAD initiative to strengthen safe and equitable university governance.',

  // cellule - additional keys used by BentoGrid
  'cellule.stats.institutes': 'Institutes',
  'cellule.stats.confidentiality': 'Confidentiality',
  'cellule.stats.assignedProfessional': 'Assigned Professional',
  'cellule.stats.steps': 'Process steps',

  'cellule.quickAccess.title': 'Quick Access Reporting',
  'cellule.quickAccess.desc': 'Securely access the confidential reporting form at any time.',

  'cellule.structuredWorkflow.title': 'Structured Case Workflow',
  'cellule.structuredWorkflow.desc': 'Report safely. Receive guidance. Get support.',

  'cellule.firstContactLabel': 'initial contact',

  'cellule.security.title': 'Ethical & Legal Compliance',
  'cellule.security.desc': 'Managed in accordance with university regulations and international standards.',

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

  // landing / partners section
  'partners.heading': 'Our Partners',
  'partners.fundedBy': 'Funded by',
  'partners.eu.alt': 'European Union flag',
  'partners.eu.label': 'European Union',

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
    'psychotherapists.heading': 'Our therapists',
  'psychotherapists.subtitle': 'Find the assigned professional for your institute.',
  'psychotherapists.specialties': 'Specialties',
  'psychotherapists.availability': 'Availability',
  'psychotherapists.locations': 'Institutions',
  'psychotherapists.contact': 'Contact',
  'psychotherapists.report.title': 'Report a situation',
  'psychotherapists.report.to': 'to {name}',
  'psychotherapists.report.nameLabel': 'Your name',
  'psychotherapists.report.placeholderName': 'Full name',
  'psychotherapists.report.emailLabel': 'Email',
  'psychotherapists.report.placeholderEmail': 'your.email@example.com',
  'psychotherapists.report.phoneLabel': 'Phone',
  'psychotherapists.report.placeholderPhone': 'XX XXX XXX',
  'psychotherapists.report.descriptionLabel': 'Situation description',
  'psychotherapists.report.descriptionPlaceholder': 'Briefly describe the situation...',
  'psychotherapists.report.sending': 'Sending...',
  'psychotherapists.report.submit': 'Send report',
  'psychotherapists.report.button': 'Report a situation',
  'psychotherapists.report.ariaLabel': 'Report a situation to {name}',
  'psychotherapists.report.modalTitle': 'Report a situation',
  'psychotherapists.report.reassurance': 'You will receive a direct response by email.',
  'psychotherapists.report.contactHeading': 'Your contact details',
  'psychotherapists.report.contactReassurance': 'This information is used only by the professional to reply to you.',
  'psychotherapists.report.optional': 'optional',
  'psychotherapists.report.select': 'Select',
  'psychotherapists.report.situationHeading': 'Situation',
  'psychotherapists.report.typeLabel': 'Type of situation',
  'psychotherapists.report.periodLabel': 'Period',
  'psychotherapists.report.locationLabel': 'Main location',
  'psychotherapists.report.statsHeading': '',
  'psychotherapists.report.genderLabel': 'Gender',
  'psychotherapists.report.gender.female': 'Female',
  'psychotherapists.report.gender.male': 'Male',
  'psychotherapists.report.gender.other': 'Other',
  'psychotherapists.report.studyLevelLabel': 'Study level',
  'psychotherapists.report.studyLevel.licence': "Bachelor's",
  'psychotherapists.report.studyLevel.master': "Master's",
  'psychotherapists.report.studyLevel.doctorate': 'Doctorate',
  'psychotherapists.report.studyLevel.other': 'Other',
  'psychotherapists.report.descriptionHelper': 'Describe the situation freely. You will be contacted to discuss it.',
  'psychotherapists.report.consentText': 'I confirm my submission of this report.',
  'psychotherapists.report.cancel': 'Cancel',
  'psychotherapists.report.error.nameEmailRequired': 'Name and university email are required.',
  'psychotherapists.report.error.institutionRequired': 'Please select your institution.',
  'psychotherapists.report.error.situationTypeRequired': 'Please indicate the type of situation.',
  'psychotherapists.report.error.periodRequired': 'Please indicate the period.',
  'psychotherapists.report.error.descriptionRequired': 'Description is required.',
  'psychotherapists.report.error.genderRequired': 'Please indicate your gender (for statistics).',
  'psychotherapists.report.error.studyLevelRequired': 'Please indicate your study level (for statistics).',
  'psychotherapists.report.error.consentRequired': 'Consent is required to send the report.',
  'psychotherapists.report.error.endBeforeStart': 'End date must be after the start date.',
  'psychotherapists.report.error.sendFailed': 'An error occurred while sending. Please try again.',
  // success messages for report submission (en)
  'psychotherapists.report.successTitle': 'Report sent',
  'psychotherapists.report.successMessage': "Your report has been sent. Please check your inbox — you will soon be contacted. If you don't see the email, please check your spam folder.",
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
