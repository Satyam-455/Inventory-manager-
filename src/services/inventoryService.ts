import { localDb } from '../lib/supabase';
import { Inventory, InventoryTransaction, TransactionType, BatteryProduct } from '../types';

export const inventoryService = {
  async getInventoryWithProducts(): Promise<Inventory[]> {
    const inventory = localDb.getInventory();
    const batteries = localDb.getBatteries();
    return inventory.map(item => ({
      ...item,
      battery: batteries.find(b => b.id === item.battery_id)
    }));
  },

  async getLowStockItems(): Promise<Inventory[]> {
    const all = await this.getInventoryWithProducts();
    return all.filter(item => item.stock_quantity <= item.low_stock_threshold);
  },

  async getTransactions(): Promise<InventoryTransaction[]> {
    const transactions = localDb.getTransactions();
    const batteries = localDb.getBatteries();
    return transactions
      .map(tx => ({
        ...tx,
        battery: batteries.find(b => b.id === tx.battery_id)
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async updateStock(
    batteryId: string, 
    type: TransactionType, 
    quantityChange: number, 
    referenceType: string = 'MANUAL', 
    referenceId?: string, 
    notes?: string
  ): Promise<Inventory> {
    const inventoryList = localDb.getInventory();
    const item = inventoryList.find(i => i.battery_id === batteryId);
    
    if (!item) {
      throw new Error('Inventory record not found for battery ID');
    }

    let newStock = item.stock_quantity;
    if (type === 'IN') {
      newStock += Math.abs(quantityChange);
    } else if (type === 'OUT') {
      if (item.stock_quantity < quantityChange) {
        throw new Error(`Insufficient stock. Current stock: ${item.stock_quantity}, requested: ${quantityChange}`);
      }
      newStock -= Math.abs(quantityChange);
    } else if (type === 'ADJUSTMENT') {
      newStock = quantityChange;
    }

    item.stock_quantity = newStock;
    item.updated_at = new Date().toISOString();
    localDb.saveInventory(inventoryList);

    // Record Transaction Log
    const transactions = localDb.getTransactions();
    const newTx: InventoryTransaction = {
      id: `tx_${Date.now()}`,
      battery_id: batteryId,
      transaction_type: type,
      quantity: Math.abs(quantityChange),
      reference_type: referenceType,
      reference_id: referenceId,
      notes: notes || `Stock update: ${type} ${quantityChange}`,
      created_at: new Date().toISOString()
    };
    transactions.push(newTx);
    localDb.saveTransactions(transactions);

    return item;
  }
};
