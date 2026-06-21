import type { AppData } from '../types/models'

const now = new Date()
const iso = (daysAgo: number) => {
  const d = new Date(now)
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().slice(0, 10)
}

export const DEMO_DATA: AppData = {
  accounts: [
    {
      id: 'demo-acc-1',
      bankName: 'Santander',
      accountName: 'Cuenta Corriente',
      accountType: 'checking',
      balance: 850000,
      icon: 'Landmark',
      createdAt: iso(60),
    },
    {
      id: 'demo-acc-2',
      bankName: 'Banco Chile',
      accountName: 'Cuenta Vista',
      accountType: 'checking',
      balance: 320000,
      icon: 'Landmark',
      createdAt: iso(60),
    },
    {
      id: 'demo-acc-3',
      bankName: 'Mercado Pago',
      accountName: 'Billetera Digital',
      accountType: 'wallet',
      balance: 75000,
      icon: 'Smartphone',
      createdAt: iso(45),
    },
    {
      id: 'demo-acc-4',
      bankName: 'Efectivo',
      accountName: 'Cartera',
      accountType: 'cash',
      balance: 40000,
      icon: 'Banknote',
      createdAt: iso(30),
    },
  ],
  debts: [
    {
      id: 'demo-debt-1',
      name: 'Tarjeta de Crédito',
      institution: 'Banco Falabella',
      totalAmount: 1200000,
      remainingAmount: 780000,
      minimumPayment: 60000,
      icon: 'CreditCard',
      createdAt: iso(90),
    },
    {
      id: 'demo-debt-2',
      name: 'Crédito de Consumo',
      institution: 'Banco Chile',
      totalAmount: 2500000,
      remainingAmount: 1900000,
      minimumPayment: 120000,
      icon: 'Landmark',
      createdAt: iso(120),
    },
  ],
  expenses: [
    { id: 'demo-exp-1', name: 'Café con leche', category: 'cafe-snacks', amount: 3500, date: iso(2), createdAt: iso(2) },
    { id: 'demo-exp-2', name: 'Pedidos Ya', category: 'delivery', amount: 18000, date: iso(3), createdAt: iso(3) },
    { id: 'demo-exp-3', name: 'Skin de Valorant', category: 'gaming', amount: 12000, date: iso(5), createdAt: iso(5) },
    { id: 'demo-exp-4', name: 'Polera oferta', category: 'compras-impulsivas', amount: 22000, date: iso(7), createdAt: iso(7) },
    { id: 'demo-exp-5', name: 'Cine con Pamela', category: 'salidas-pamela', amount: 35000, date: iso(8), createdAt: iso(8) },
    { id: 'demo-exp-6', name: 'Entrada al estadio', category: 'cobreloa', amount: 15000, date: iso(10), createdAt: iso(10) },
    { id: 'demo-exp-7', name: 'Bencina', category: 'auto-groove', amount: 25000, date: iso(12), createdAt: iso(12) },
    { id: 'demo-exp-8', name: 'Suscripción Spotify', category: 'suscripciones', amount: 5990, date: iso(15), createdAt: iso(15) },
    { id: 'demo-exp-9', name: 'Sushi delivery', category: 'delivery', amount: 28000, date: iso(1), createdAt: iso(1) },
  ],
  payments: [
    { id: 'demo-pay-1', debtId: 'demo-debt-1', amount: 60000, date: iso(20), createdAt: iso(20) },
  ],
  settings: { monthlyAntBudget: 150000 },
}
