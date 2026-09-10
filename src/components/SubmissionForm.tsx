'use client';

import { useState, useEffect } from 'react';
import { ClassDefinition, RelationshipDefinition } from '@/domain/models/Submission';

interface SubmissionFormProps {
  attemptId: string;
  problemSlug?: string;
  initialClasses?: ClassDefinition[];
  initialRelationships?: RelationshipDefinition[];
  initialRationale?: string;
  status: string;
  onSubmitted?: (attemptId: string) => void;
}

export default function SubmissionForm({
  attemptId,
  problemSlug,
  initialClasses = [],
  initialRelationships = [],
  initialRationale = '',
  status,
  onSubmitted,
}: SubmissionFormProps) {
  const [classes, setClasses] = useState<ClassDefinition[]>(initialClasses);
  const [relationships, setRelationships] = useState<RelationshipDefinition[]>(initialRelationships);
  const [rationale, setRationale] = useState<string>(initialRationale);

  const [saving, setSaving] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (initialClasses.length > 0) setClasses(initialClasses);
    if (initialRelationships.length > 0) setRelationships(initialRelationships);
    if (initialRationale) setRationale(initialRationale);
  }, [initialClasses, initialRelationships, initialRationale]);

  // Auto dismiss toast message after 4 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Starter Template Loader for fast practice/testing across all 8 problems
  const handleLoadSampleTemplate = () => {
    if (problemSlug === 'parking-lot') {
      setClasses([
        {
          name: 'ParkingLot',
          type: 'class',
          responsibility: 'Coordinates parking spot allocations and entry/exit gates.',
          fields: ['id: String', 'capacity: Int'],
          methods: ['parkVehicle(v: Vehicle): Boolean', 'vacateSpot(spotId: String): Boolean'],
        },
        {
          name: 'ParkingSpot',
          type: 'class',
          responsibility: 'Represents a physical parking slot state and vehicle assignment.',
          fields: ['spotId: String', 'isOccupied: Boolean', 'spotSize: SpotSize'],
          methods: ['occupySpot()', 'vacateSpot()'],
        },
        {
          name: 'IPricingStrategy',
          type: 'interface',
          responsibility: 'Polymorphic interface for pricing strategy calculations.',
          fields: [],
          methods: ['calculateFee(durationHours: Number): Number'],
        },
        {
          name: 'HourlyPricingStrategy',
          type: 'class',
          responsibility: 'Calculates parking fees based on hourly rate multipliers.',
          fields: ['hourlyRate: Double'],
          methods: ['calculateFee(durationHours: Number): Number'],
        },
      ]);
      setRelationships([
        { from: 'ParkingLot', to: 'ParkingSpot', kind: 'composes' },
        { from: 'ParkingLot', to: 'IPricingStrategy', kind: 'uses' },
        { from: 'HourlyPricingStrategy', to: 'IPricingStrategy', kind: 'implements' },
      ]);
      setRationale('Used Strategy pattern for pricing to allow runtime selection of flat vs dynamic hourly rates.');
    } else if (problemSlug === 'elevator-system') {
      setClasses([
        {
          name: 'ElevatorController',
          type: 'class',
          responsibility: 'Coordinates movement requests across the elevator fleet.',
          fields: ['fleet: ElevatorCar[]'],
          methods: ['handleHallCall(floor: Int, dir: Direction)', 'dispatch()'],
        },
        {
          name: 'ElevatorCar',
          type: 'class',
          responsibility: 'Models single elevator car state and floor position.',
          fields: ['carId: String', 'currentFloor: Int', 'state: ElevatorState'],
          methods: ['moveUp()', 'moveDown()', 'openDoor()'],
        },
        {
          name: 'IDispatchStrategy',
          type: 'interface',
          responsibility: 'Interface for elevator dispatch strategy algorithms.',
          fields: [],
          methods: ['selectElevator(fleet: ElevatorCar[], targetFloor: Int): ElevatorCar'],
        },
        {
          name: 'NearestElevatorDispatch',
          type: 'class',
          responsibility: 'Dispatches the nearest available idle elevator car.',
          fields: [],
          methods: ['selectElevator(fleet: ElevatorCar[], targetFloor: Int): ElevatorCar'],
        },
      ]);
      setRelationships([
        { from: 'ElevatorController', to: 'ElevatorCar', kind: 'composes' },
        { from: 'ElevatorController', to: 'IDispatchStrategy', kind: 'uses' },
        { from: 'NearestElevatorDispatch', to: 'IDispatchStrategy', kind: 'implements' },
      ]);
      setRationale('Used Strategy pattern to decouple elevator selection algorithms from controller logic.');
    } else if (problemSlug === 'vending-machine') {
      setClasses([
        {
          name: 'VendingMachine',
          type: 'class',
          responsibility: 'Coordinates inventory state transitions and payment processing.',
          fields: ['state: IVendingState', 'balance: Double'],
          methods: ['insertCoin(amount: Double)', 'dispenseItem(code: String)'],
        },
        {
          name: 'IPaymentMethod',
          type: 'interface',
          responsibility: 'Interface for pluggable payment method processing.',
          fields: [],
          methods: ['processPayment(amount: Double): Boolean'],
        },
        {
          name: 'CashPaymentMethod',
          type: 'class',
          responsibility: 'Processes physical cash payment notes and calculates change.',
          fields: ['cashInserted: Double'],
          methods: ['processPayment(amount: Double): Boolean'],
        },
        {
          name: 'Item',
          type: 'class',
          responsibility: 'Models inventory items with slot code and unit price.',
          fields: ['code: String', 'price: Double', 'quantity: Int'],
        },
      ]);
      setRelationships([
        { from: 'VendingMachine', to: 'IPaymentMethod', kind: 'uses' },
        { from: 'CashPaymentMethod', to: 'IPaymentMethod', kind: 'implements' },
        { from: 'VendingMachine', to: 'Item', kind: 'composes' },
      ]);
      setRationale('Used Strategy pattern for payment methods and state pattern for vending state flow.');
    } else if (problemSlug === 'rate-limiter') {
      setClasses([
        {
          name: 'RateLimiterService',
          type: 'class',
          responsibility: 'Throttles incoming HTTP client requests against quota limits.',
          fields: ['rulesConfig: RuleConfig'],
          methods: ['allowRequest(clientId: String): Boolean'],
        },
        {
          name: 'IRateLimitingAlgorithm',
          type: 'interface',
          responsibility: 'Interface for pluggable rate limiting algorithm strategies.',
          fields: [],
          methods: ['isAllowed(clientId: String, limit: Int): Boolean'],
        },
        {
          name: 'TokenBucketAlgorithm',
          type: 'class',
          responsibility: 'Implements token bucket algorithm with refill rate logic.',
          fields: ['capacity: Int', 'refillRate: Double'],
          methods: ['isAllowed(clientId: String, limit: Int): Boolean'],
        },
      ]);
      setRelationships([
        { from: 'RateLimiterService', to: 'IRateLimitingAlgorithm', kind: 'uses' },
        { from: 'TokenBucketAlgorithm', to: 'IRateLimitingAlgorithm', kind: 'implements' },
      ]);
      setRationale('Used Strategy pattern for rate limiting algorithms to allow token bucket vs sliding log algorithms.');
    } else if (problemSlug === 'notification-service') {
      setClasses([
        {
          name: 'NotificationManager',
          type: 'class',
          responsibility: 'Orchestrates message queue dispatch across delivery channels.',
          fields: ['userPrefs: UserPreferences'],
          methods: ['sendNotification(userId: String, msg: Message)'],
        },
        {
          name: 'INotificationChannel',
          type: 'interface',
          responsibility: 'Interface for polymorphic notification channel dispatchers.',
          fields: [],
          methods: ['dispatch(msg: Message): Boolean'],
        },
        {
          name: 'EmailNotificationChannel',
          type: 'class',
          responsibility: 'Dispatches HTML email notifications via provider APIs.',
          fields: ['smtpHost: String'],
          methods: ['dispatch(msg: Message): Boolean'],
        },
        {
          name: 'SMSNotificationChannel',
          type: 'class',
          responsibility: 'Dispatches SMS text messages via Twilio gateway.',
          fields: ['apiKey: String'],
          methods: ['dispatch(msg: Message): Boolean'],
        },
      ]);
      setRelationships([
        { from: 'NotificationManager', to: 'INotificationChannel', kind: 'uses' },
        { from: 'EmailNotificationChannel', to: 'INotificationChannel', kind: 'implements' },
        { from: 'SMSNotificationChannel', to: 'INotificationChannel', kind: 'implements' },
      ]);
      setRationale('Used Strategy pattern for notification delivery channels to support SMS, Email, and Push dispatchers.');
    } else if (problemSlug === 'tic-tac-toe') {
      setClasses([
        {
          name: 'TicTacToeGame',
          type: 'class',
          responsibility: 'Manages board state and coordinates player turns.',
          fields: ['board: Board', 'players: Player[]'],
          methods: ['playTurn(row: Int, col: Int)', 'checkWinner(): Symbol'],
        },
        {
          name: 'IBotMoveStrategy',
          type: 'interface',
          responsibility: 'Interface for pluggable AI bot move selection strategies.',
          fields: [],
          methods: ['calculateNextMove(board: Board): Position'],
        },
        {
          name: 'MinimaxBotMoveStrategy',
          type: 'class',
          responsibility: 'Calculates optimal board moves using minimax decision tree.',
          fields: [],
          methods: ['calculateNextMove(board: Board): Position'],
        },
        {
          name: 'Board',
          type: 'class',
          responsibility: 'Models N x N grid state and win sequence validation.',
          fields: ['grid: Symbol[][]', 'size: Int'],
          methods: ['placeMark(r: Int, c: Int, sym: Symbol): Boolean'],
        },
      ]);
      setRelationships([
        { from: 'TicTacToeGame', to: 'IBotMoveStrategy', kind: 'uses' },
        { from: 'MinimaxBotMoveStrategy', to: 'IBotMoveStrategy', kind: 'implements' },
        { from: 'TicTacToeGame', to: 'Board', kind: 'composes' },
      ]);
      setRationale('Used Strategy pattern for bot move selection to allow difficulty levels (Easy Random vs Hard Minimax).');
    } else if (problemSlug === 'atm-machine') {
      setClasses([
        {
          name: 'ATMMachine',
          type: 'class',
          responsibility: 'Coordinates card validation and account transaction workflows.',
          fields: ['cashInventory: CashDispenser', 'state: ATMState'],
          methods: ['insertCard(card: Card)', 'enterPin(pin: String)', 'withdraw(amount: Double)'],
        },
        {
          name: 'IDispenseStrategy',
          type: 'interface',
          responsibility: 'Interface for pluggable cash bill denomination dispensing logic.',
          fields: [],
          methods: ['dispenseCash(amount: Double): NoteCountMap'],
        },
        {
          name: 'FewestNotesDispenseStrategy',
          type: 'class',
          responsibility: 'Calculates cash dispensing using fewest bill count algorithm.',
          fields: [],
          methods: ['dispenseCash(amount: Double): NoteCountMap'],
        },
        {
          name: 'CashDispenser',
          type: 'class',
          responsibility: 'Manages physical bill tray inventory across note values.',
          fields: ['twentiesCount: Int', 'fiftiesCount: Int', 'hundredsCount: Int'],
        },
      ]);
      setRelationships([
        { from: 'ATMMachine', to: 'IDispenseStrategy', kind: 'uses' },
        { from: 'FewestNotesDispenseStrategy', to: 'IDispenseStrategy', kind: 'implements' },
        { from: 'ATMMachine', to: 'CashDispenser', kind: 'composes' },
      ]);
      setRationale('Used Strategy pattern for cash dispensing and State pattern for ATM card processing states.');
    } else {
      // Default fallback sample template
      setClasses([
        {
          name: 'SystemController',
          type: 'class',
          responsibility: 'Manages main workflows and coordinates component state.',
          fields: ['id: String'],
          methods: ['processRequest()'],
        },
        {
          name: 'IServiceStrategy',
          type: 'interface',
          responsibility: 'Interface for pluggable business logic strategy operations.',
          fields: [],
          methods: ['execute()'],
        },
        {
          name: 'DefaultServiceStrategy',
          type: 'class',
          responsibility: 'Concrete implementation of default service strategy.',
          fields: [],
          methods: ['execute()'],
        },
      ]);
      setRelationships([
        { from: 'SystemController', to: 'IServiceStrategy', kind: 'uses' },
        { from: 'DefaultServiceStrategy', to: 'IServiceStrategy', kind: 'implements' },
      ]);
    }

    setMessage({ type: 'success', text: 'Sample starter design template loaded!' });
  };

  // Class Management
  const addClass = (type: 'class' | 'interface' | 'abstract_class' | 'enum' = 'class') => {
    let newName = `Component${classes.length + 1}`;
    if (type === 'interface') newName = `IComponent${classes.length + 1}`;
    if (type === 'abstract_class') newName = `AbstractComponent${classes.length + 1}`;

    setClasses([
      ...classes,
      {
        name: newName,
        type,
        responsibility: '',
        fields: [],
        methods: [],
      },
    ]);
  };

  const updateClass = (index: number, updated: Partial<ClassDefinition>) => {
    const next = [...classes];
    next[index] = { ...next[index], ...updated };
    setClasses(next);
  };

  const removeClass = (index: number) => {
    const classNameToRemove = classes[index]?.name;
    setClasses(classes.filter((_, i) => i !== index));
    if (classNameToRemove) {
      setRelationships(relationships.filter(r => r.from !== classNameToRemove && r.to !== classNameToRemove));
    }
  };

  const addField = (classIndex: number, fieldStr: string) => {
    if (!fieldStr.trim()) return;
    const next = [...classes];
    const currentFields = next[classIndex].fields || [];
    next[classIndex].fields = [...currentFields, fieldStr.trim()];
    setClasses(next);
  };

  const removeField = (classIndex: number, fieldIdx: number) => {
    const next = [...classes];
    next[classIndex].fields = (next[classIndex].fields || []).filter((_, i) => i !== fieldIdx);
    setClasses(next);
  };

  const addMethod = (classIndex: number, methodStr: string) => {
    if (!methodStr.trim()) return;
    const next = [...classes];
    const currentMethods = next[classIndex].methods || [];
    next[classIndex].methods = [...currentMethods, methodStr.trim()];
    setClasses(next);
  };

  const removeMethod = (classIndex: number, methodIdx: number) => {
    const next = [...classes];
    next[classIndex].methods = (next[classIndex].methods || []).filter((_, i) => i !== methodIdx);
    setClasses(next);
  };

  // Relationship Management
  const addRelationship = () => {
    if (classes.length < 2) return;
    setRelationships([
      ...relationships,
      {
        from: classes[0].name,
        to: classes[1].name,
        kind: 'uses',
      },
    ]);
  };

  const updateRelationship = (index: number, updated: Partial<RelationshipDefinition>) => {
    const next = [...relationships];
    next[index] = { ...next[index], ...updated };
    setRelationships(next);
  };

  const removeRelationship = (index: number) => {
    setRelationships(relationships.filter((_, i) => i !== index));
  };

  // Actions
  const handleSaveDraft = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/attempts/${attemptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classes, relationships, rationale }),
      });

      if (!res.ok) throw new Error('Failed to save draft');
      setMessage({ type: 'success', text: 'Draft saved successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error saving draft' });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitEvaluation = async () => {
    if (classes.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one class or interface before submitting.' });
      return;
    }

    setEvaluating(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/attempts/${attemptId}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classes, relationships, rationale }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Evaluation failed.');
      }

      if (onSubmitted) {
        onSubmitted(attemptId);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error evaluating attempt' });
    } finally {
      setEvaluating(false);
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'interface':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'abstract_class':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'enum':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold border flex items-center justify-between shadow-sm animate-fade-in ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <span className="flex items-center gap-2">
            <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
            {message.text}
          </span>
          <button onClick={() => setMessage(null)} className="text-xs text-slate-500 hover:text-slate-800 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* QUICK TEMPLATE STARTER HEADER */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-indigo-100 bg-white">
        <div>
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">
            ⚡ Quick Practice Helper
          </span>
          <p className="text-xs text-slate-500">
            Click to load starter design entities and test evaluation rules immediately.
          </p>
        </div>

        <button
          onClick={handleLoadSampleTemplate}
          className="button-press px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all flex items-center gap-2"
        >
          <span>✨ Load Sample Starter Design</span>
        </button>
      </div>

      {/* SECTION 1: CLASSES & INTERFACES */}
      <div className="glass-card p-6 bg-white border-slate-200">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>📦</span> Domain Entities & Interfaces ({classes.length})
            </h3>
            <p className="text-xs text-slate-500">
              Declare concrete classes, interfaces, abstract classes, and single responsibilities.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => addClass('class')}
              className="button-press px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-2xs"
            >
              + Class
            </button>
            <button
              onClick={() => addClass('interface')}
              className="button-press px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-2xs"
            >
              + Interface
            </button>
          </div>
        </div>

        {classes.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <p className="text-slate-500 text-sm mb-4">No classes added to this design workspace yet.</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => addClass('class')}
                className="button-press px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Add First Class
              </button>
              <button
                onClick={handleLoadSampleTemplate}
                className="button-press px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
              >
                Load Starter Template
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {classes.map((c, classIdx) => {
              const respLength = (c.responsibility || '').trim().length;
              const hasMultipleAnds = ((c.responsibility || '').toLowerCase().match(/\b(and|also)\b/g) || []).length >= 2;

              return (
                <div
                  key={classIdx}
                  className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4 relative group hover:border-indigo-300 transition-all duration-200 shadow-2xs animate-fade-in"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border uppercase ${getTypeBadge(c.type)}`}>
                      {c.type.replace('_', ' ')}
                    </span>

                    <button
                      onClick={() => removeClass(classIdx)}
                      className="text-slate-400 hover:text-rose-600 text-xs font-semibold transition-colors"
                    >
                      ✕ Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">
                        Entity Name
                      </label>
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) => updateClass(classIdx, { name: e.target.value })}
                        placeholder="e.g. ParkingLot"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">
                        Entity Type
                      </label>
                      <select
                        value={c.type}
                        onChange={(e) => updateClass(classIdx, { type: e.target.value as any })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      >
                        <option value="class">Concrete Class</option>
                        <option value="interface">Interface</option>
                        <option value="abstract_class">Abstract Class</option>
                        <option value="enum">Enum</option>
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-600">
                          Single Responsibility Description (SRP)
                        </label>
                        <div className="flex items-center gap-2">
                          {respLength > 0 && respLength < 10 && (
                            <span className="text-[10px] text-amber-700 font-bold">⚠️ Vague description</span>
                          )}
                          {hasMultipleAnds && (
                            <span className="text-[10px] text-rose-700 font-bold">⚠️ Multiple duties (SRP Risk)</span>
                          )}
                          <span className="text-[10px] text-slate-400">{respLength} chars</span>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={c.responsibility}
                        onChange={(e) => updateClass(classIdx, { responsibility: e.target.value })}
                        placeholder="e.g. Coordinates parking spot allocations and updates availability state."
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Attributes & Operations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Fields */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <span className="text-xs font-bold text-slate-600 block mb-2">
                        Attributes / State Fields ({c.fields?.length || 0})
                      </span>

                      <div className="flex gap-2 mb-2">
                        <input
                          id={`new-field-${classIdx}`}
                          type="text"
                          placeholder="e.g. spotId: String"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addField(classIdx, e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const inputEl = document.getElementById(`new-field-${classIdx}`) as HTMLInputElement;
                            if (inputEl) {
                              addField(classIdx, inputEl.value);
                              inputEl.value = '';
                            }
                          }}
                          className="button-press px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-bold border border-slate-200"
                        >
                          + Add
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(c.fields || []).map((f, fIdx) => (
                          <span
                            key={fIdx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-xs font-mono text-slate-700 border border-slate-200"
                          >
                            {f}
                            <button
                              onClick={() => removeField(classIdx, fIdx)}
                              className="text-slate-400 hover:text-rose-600 text-xs ml-1 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Methods */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <span className="text-xs font-bold text-slate-600 block mb-2">
                        Methods / Operations ({c.methods?.length || 0})
                      </span>

                      <div className="flex gap-2 mb-2">
                        <input
                          id={`new-method-${classIdx}`}
                          type="text"
                          placeholder="e.g. parkVehicle(v: Vehicle): Boolean"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addMethod(classIdx, e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const inputEl = document.getElementById(`new-method-${classIdx}`) as HTMLInputElement;
                            if (inputEl) {
                              addMethod(classIdx, inputEl.value);
                              inputEl.value = '';
                            }
                          }}
                          className="button-press px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-bold border border-slate-200"
                        >
                          + Add
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(c.methods || []).map((m, mIdx) => (
                          <span
                            key={mIdx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-xs font-mono text-indigo-800 border border-indigo-100"
                          >
                            {m}
                            <button
                              onClick={() => removeMethod(classIdx, mIdx)}
                              className="text-indigo-400 hover:text-rose-600 text-xs ml-1 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: RELATIONSHIPS */}
      <div className="glass-card p-6 bg-white border-slate-200">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>🔗</span> Domain Relationships ({relationships.length})
            </h3>
            <p className="text-xs text-slate-500">
              Declare inheritance, composition, aggregation, and interface implementations.
            </p>
          </div>

          <button
            onClick={addRelationship}
            disabled={classes.length < 2}
            className="button-press px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-40"
          >
            + Add Relationship
          </button>
        </div>

        {relationships.length === 0 ? (
          <p className="text-slate-400 text-xs italic py-2">
            No relationships declared yet. Define connections between entities once you have at least 2 components.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {relationships.map((rel, relIdx) => (
                <div
                  key={relIdx}
                  className="flex flex-wrap items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl animate-fade-in"
                >
                  <select
                    value={rel.from}
                    onChange={(e) => updateRelationship(relIdx, { from: e.target.value })}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono shadow-2xs"
                  >
                    {classes.map((c, i) => (
                      <option key={i} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={rel.kind}
                    onChange={(e) => updateRelationship(relIdx, { kind: e.target.value as any })}
                    className="bg-white border border-indigo-200 rounded-lg px-3 py-1.5 text-xs text-indigo-700 font-bold shadow-2xs"
                  >
                    <option value="uses">-- uses --&gt;</option>
                    <option value="inherits">-- inherits --&gt;</option>
                    <option value="implements">-- implements --&gt;</option>
                    <option value="composes">◆ composes --&gt;</option>
                    <option value="aggregates">◇ aggregates --&gt;</option>
                  </select>

                  <select
                    value={rel.to}
                    onChange={(e) => updateRelationship(relIdx, { to: e.target.value })}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono shadow-2xs"
                  >
                    {classes.map((c, i) => (
                      <option key={i} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => removeRelationship(relIdx)}
                    className="ml-auto text-slate-400 hover:text-rose-600 text-xs px-2 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: DESIGN RATIONALE */}
      <div className="glass-card p-6 bg-white border-slate-200">
        <h3 className="text-lg font-extrabold text-slate-900 mb-2 flex items-center gap-2">
          <span>📝</span> Architectural Rationale (Optional)
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Explain key trade-offs, design patterns applied (e.g. Strategy, Factory, Observer), and extension points.
        </p>
        <textarea
          rows={3}
          value={rationale}
          onChange={(e) => setRationale(e.target.value)}
          placeholder="e.g. Applied Strategy pattern for pricing to decouple calculation algorithms from main controller..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
        />
      </div>

      {/* STICKY GLASS BOTTOM ACTIONS BAR */}
      <div className="sticky bottom-4 z-40 glass-card p-4 flex items-center justify-between shadow-xl border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <span className="text-xs px-3 py-1 rounded-full font-bold bg-slate-100 text-indigo-700 border border-slate-200">
            {status}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={saving || evaluating}
            className="button-press px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : '💾 Save Draft'}
          </button>

          <button
            onClick={handleSubmitEvaluation}
            disabled={saving || evaluating || classes.length === 0}
            className="button-press px-6 py-2.5 rounded-xl text-xs font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {evaluating ? (
              <>
                <span className="animate-spin text-xs">🌀</span> Evaluating...
              </>
            ) : (
              <>🚀 Submit & Evaluate Design</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
