import Dexie from "dexie";

export const db = new Dexie("glampProfit");
db.version(1).stores({
  expenses: "++id, expense_head, amount, categoryId, description, last_updated",
  commissions: "++id, commission_rate, last_updated",
  category_constants:
    "++id, categoryId, name, description, monthly_conversion_constant",
});
