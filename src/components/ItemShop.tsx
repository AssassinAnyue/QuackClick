import { GameState, GameAction } from '../types';
import { ITEMS } from '../gameData';
import { formatNumber } from '../utils';

interface ItemShopProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function ItemShop({ state, dispatch }: ItemShopProps) {
  const handlePurchase = (itemId: string) => {
    dispatch({ type: 'PURCHASE_ITEM', itemId });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-fit max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-center mb-4 text-yellow-700 border-b-2 border-yellow-300 pb-2">
        道具商店
      </h2>
      
      <div className="space-y-2">
        {ITEMS.map(item => {
          const isPurchased = state.purchasedItems.has(item.id);
          const canAfford = state.quack >= item.cost;
          const isAvailable = !isPurchased && canAfford;

          return (
            <button
              key={item.id}
              onClick={() => handlePurchase(item.id)}
              disabled={isPurchased || !canAfford}
              className={`
                w-full text-left p-3 rounded-lg transition-all
                ${isPurchased
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-2 border-green-500'
                  : isAvailable
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 border-2 border-yellow-300 hover:border-yellow-500 shadow-md hover:shadow-lg'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
                }
              `}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{item.name}</span>
                    {isPurchased && (
                      <span className="text-green-600 font-bold">✓</span>
                    )}
                  </div>
                  <p className="text-sm mt-1">{item.description}</p>
                </div>
                <div className={`
                  font-bold whitespace-nowrap ml-2
                  ${isPurchased ? 'text-green-600' : canAfford ? 'text-orange-600' : 'text-gray-400'}
                `}>
                  {formatNumber(item.cost)}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Purchased items summary */}
      {state.purchasedItems.size > 0 && (
        <div className="mt-6 pt-4 border-t-2 border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            已購買道具: {state.purchasedItems.size}/{ITEMS.length}
          </p>
        </div>
      )}
    </div>
  );
}


