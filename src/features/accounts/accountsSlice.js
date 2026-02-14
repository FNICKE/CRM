import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accounts: [
    { id: 1, name: 'Freda', email: 'fwinger0@fc2.com', phone: '5967957899', website: 'http://fc2.com', industry: 'n/a', status: true, remark: '' },
    { id: 2, name: 'Aloysius', email: 'amellanby1@lycos.com', phone: '4988111631', website: 'http://sun.com', industry: 'Real Estate', status: false, remark: 'nulla nisl nunc' },
    { id: 3, name: 'Dalli', email: 'dturnell2@reference.com', phone: '9919131652', website: 'http://51.la', industry: 'Hospital Management', status: false, remark: '' },
    { id: 4, name: 'Kort', email: 'ktrittam3@sakura.ne.jp', phone: '4928500329', website: 'http://walmart.com', industry: 'EDP Services', status: false, remark: 'id ornare imperdiet' },
    { id: 5, name: 'Heall', email: 'hsilson4@pinterest.com', phone: '3862338325', website: 'http://st.edu', industry: 'n/a', status: false, remark: 'auctor gravida sem' },
    { id: 6, name: 'Sheeree', email: 'sjeannin5@bigcartel.com', phone: '4335616798', website: 'https://amazon.com', industry: 'Automotive Aftermarket', status: false, remark: 'quis turpis' },
    { id: 7, name: 'Hildegarde', email: 'hdurdy6@mysql.com', phone: '8059908180', website: 'https://huffpost.com', industry: 'Industrial Specialties', status: true, remark: '' },
    { id: 8, name: 'Hulda', email: 'hcruickshanks7@answers.com', phone: '8705495500', website: 'https://yandex.ru', industry: 'Package Goods', status: true, remark: 'platea dictumst' },
    { id: 9, name: 'Shae', email: 'stales8@google.pl', phone: '4628674456', website: 'http://mayoclinic.com', industry: 'Machinery Components', status: true, remark: 'eget orci vehicula' },
    { id: 10, name: 'Jana', email: 'jhugk9@wikispaces.com', phone: '4222905888', website: 'https://jugem.jp', industry: 'n/a', status: true, remark: 'eu est' },
    { id: 11, name: 'Lorin', email: 'lsmith@yahoo.com', phone: '2025550101', website: 'https://github.com', industry: 'Software Tech', status: true, remark: 'vanguard project' },
    { id: 12, name: 'Merrick', email: 'm.vance@outlook.com', phone: '3125550123', website: 'http://vance.io', industry: 'Consulting', status: false, remark: 'follow up next week' },
    { id: 13, name: 'Krystal', email: 'krys.lee@gmail.com', phone: '4155550199', website: 'https://stripe.com', industry: 'Fintech', status: true, remark: 'priority client' },
    { id: 14, name: 'Brant', email: 'b.stokes@apple.com', phone: '5105550144', website: 'https://apple.com', industry: 'Electronics', status: true, remark: '' },
    { id: 15, name: 'Sutton', email: 's.pierce@bbc.co.uk', phone: '2075550155', website: 'http://bbc.com', industry: 'Media', status: false, remark: 'review pending' },
    { id: 16, name: 'Tiana', email: 'tiana.r@adobe.com', phone: '4085550166', website: 'https://adobe.com', industry: 'Creative Tools', status: true, remark: 'creative cloud lead' },
    { id: 17, name: 'Vance', email: 'v.joyce@tesla.com', phone: '6505550177', website: 'https://tesla.com', industry: 'Automotive', status: true, remark: 'energy sector' },
    { id: 18, name: 'Willa', email: 'w.hunt@nike.com', phone: '5035550188', website: 'http://nike.com', industry: 'Apparel', status: false, remark: 'out of office' },
    { id: 19, name: 'Xander', email: 'x.bolt@uber.com', phone: '4155550111', website: 'http://uber.com', industry: 'Logistics', status: true, remark: 'fleet manager' },
    { id: 20, name: 'Yara', email: 'y.shah@netflix.com', phone: '3105550122', website: 'http://netflix.com', industry: 'Entertainment', status: true, remark: 'content lead' },
    { id: 21, name: 'Zane', email: 'z.grey@spotify.com', phone: '2125550133', website: 'http://spotify.com', industry: 'Music', status: false, remark: 'subscription trial' },
    { id: 22, name: 'Quinn', email: 'q.adams@nasa.gov', phone: '2025550144', website: 'http://nasa.gov', industry: 'Aerospace', status: true, remark: 'research grant' }
  ],
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    addAccount: (state, action) => {
      state.accounts.unshift({
        id: Date.now(),
        ...action.payload
      });
    },
    updateAccount: (state, action) => {
      const index = state.accounts.findIndex(acc => acc.id === action.payload.id);
      if (index !== -1) {
        state.accounts[index] = action.payload;
      }
    },
    deleteAccount: (state, action) => {
      state.accounts = state.accounts.filter(acc => acc.id !== action.payload);
    },
    resetAccounts: (state) => {
      state.accounts = initialState.accounts;
    }
  },
});

export const { addAccount, updateAccount, deleteAccount, resetAccounts } = accountsSlice.actions;
export default accountsSlice.reducer;