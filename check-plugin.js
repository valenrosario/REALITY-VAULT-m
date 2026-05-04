import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';
console.log('Type of flat/recommended:', typeof firebaseRulesPlugin.configs['flat/recommended']);
console.log('Is array:', Array.isArray(firebaseRulesPlugin.configs['flat/recommended']));
console.log('Keys:', Object.keys(firebaseRulesPlugin.configs['flat/recommended']));
