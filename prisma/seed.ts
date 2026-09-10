import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding LLD Practice Platform database with 8 practice problems...');

  // Clean existing problems
  await prisma.problem.deleteMany({}).catch(() => {});

  const problems = [
    {
      title: 'Parking Lot Management System',
      slug: 'parking-lot',
      difficulty: Difficulty.MEDIUM,
      description:
        'Design an automated multi-level parking lot system capable of managing multiple vehicle types, allocating parking spots dynamically, issuing tickets at entrance gates, and computing parking fees using configurable pricing strategies.',
      requirements: [
        'Support multiple vehicle types (Motorcycle, Compact Car, Large Bus/Truck) and matching spot sizes (Small, Medium, Large).',
        'Support multiple entrance and exit gates across multiple floors.',
        'Issue digital tickets at entry with timestamps and assigned spot details.',
        'Implement dynamic spot allocation (e.g. nearest available spot to entry gate).',
        'Support pluggable pricing strategies (e.g., hourly flat rate, vehicle-type weighted pricing, peak-hour multiplier).',
      ],
      requiresAbstraction: ['pricing strategy'],
    },
    {
      title: 'Elevator Control System',
      slug: 'elevator-system',
      difficulty: Difficulty.HARD,
      description:
        'Design a multi-elevator dispatch and control system for a modern high-rise building that coordinates elevator movements efficiently to minimize passenger wait times.',
      requirements: [
        'Control a fleet of N elevators operating across M floors.',
        'Handle external hall calls (floor level + up/down direction) and internal floor requests (target floor selection inside elevator car).',
        'Support pluggable elevator dispatch algorithms (e.g., Nearest Elevator First, SCAN/LOOK algorithm, Energy-Saving Strategy).',
        'Manage elevator operational states (IDLE, MOVING_UP, MOVING_DOWN, DOOR_OPEN, MAINTENANCE).',
        'Handle emergency halt procedures and weight overload warnings.',
      ],
      requiresAbstraction: ['dispatch strategy'],
    },
    {
      title: 'Vending Machine System',
      slug: 'vending-machine',
      difficulty: Difficulty.MEDIUM,
      description:
        'Design a stateful vending machine system that manages product catalog inventory, handles state transitions between selection and dispensing, and processes payments via multiple payment gateways.',
      requirements: [
        'Model machine state transitions cleanly (IdleState, ItemSelectionState, PaymentState, DispensingState, OutOfStockState).',
        'Support multiple pluggable payment methods (Cash/Coins, Credit Card, UPI/Contactless Payment).',
        'Track product inventory, shelf rack slots, and unit prices.',
        'Handle change calculation when excess cash is inserted, and support transaction cancellation with full refund.',
      ],
      requiresAbstraction: ['payment method'],
    },
    {
      title: 'Library Management System',
      slug: 'library-management-system',
      difficulty: Difficulty.EASY,
      description:
        'Design a digital library management system to catalog book items, manage user memberships, track book borrowing/returns, and compute overdue fine penalties.',
      requirements: [
        'Maintain a searchable catalog of book titles, authors, ISBNs, and physical rack locations.',
        'Support multiple user roles (Librarian, Student Member, Faculty Member) with different borrowing limits.',
        'Process book checkouts, renewals, and reservations/holds.',
        'Calculate overdue fine penalties based on daily overdue rates.',
      ],
      requiresAbstraction: [],
    },
    {
      title: 'API Rate Limiter System',
      slug: 'rate-limiter',
      difficulty: Difficulty.MEDIUM,
      description:
        'Design a flexible API rate limiting system to throttle incoming client HTTP requests based on client identifier, IP address, or API token using pluggable rate limiting algorithms.',
      requirements: [
        'Track client request quotas within defined time windows.',
        'Support multiple pluggable rate limiting algorithms (Token Bucket, Leaky Bucket, Fixed Window Counter, Sliding Window Log).',
        'Return HTTP 429 Too Many Requests status when a client exceeds their allocated quota.',
        'Support dynamic rate limit configurations per client tier (Free, Pro, Enterprise).',
      ],
      requiresAbstraction: ['rate limiting algorithm'],
    },
    {
      title: 'Multi-Channel Notification System',
      slug: 'notification-service',
      difficulty: Difficulty.MEDIUM,
      description:
        'Design a scalable notification delivery platform that dispatches messages across multiple delivery channels (Email, SMS, Push Notification) with fallback providers and template rendering.',
      requirements: [
        'Support multiple delivery providers (e.g. Twilio for SMS, SendGrid for Email, Firebase for Push).',
        'Support pluggable notification channel dispatchers for fallback and retry handling.',
        'Process dynamic message templates with placeholder variable substitution.',
        'Respect user notification preferences (e.g. DND quiet hours, unsubscribed delivery channels).',
      ],
      requiresAbstraction: ['notification channel'],
    },
    {
      title: 'Tic-Tac-Toe Game Engine',
      slug: 'tic-tac-toe',
      difficulty: Difficulty.EASY,
      description:
        'Design an object-oriented Tic-Tac-Toe game supporting N x N board configurations, customizable winning sequence lengths, and pluggable AI bot strategy opponents.',
      requirements: [
        'Support configurable N x N grid sizes and target winning sequence length (K symbols in a row).',
        'Manage turn-by-turn game flow between two players (Human vs Human or Human vs AI Bot).',
        'Support pluggable bot move strategies (e.g., RandomMoveStrategy, MinimaxStrategy, BlockOpponentStrategy).',
        'Detect win conditions (horizontal, vertical, main diagonal, anti-diagonal) and draw states after each move.',
      ],
      requiresAbstraction: ['bot move strategy'],
    },
    {
      title: 'Automated Teller Machine (ATM) System',
      slug: 'atm-machine',
      difficulty: Difficulty.HARD,
      description:
        'Design a stateful Automated Teller Machine (ATM) system that handles card authentication, account balance inquiries, cash withdrawals with optimal bill denomination dispensing, and transaction logging.',
      requirements: [
        'Model ATM state transitions cleanly (IdleState, HasCardState, AuthenticatedState, DispensingCashState).',
        'Validate card PIN numbers and handle card locking after 3 failed authentication attempts.',
        'Handle cash bill dispensing across multiple denomination slots ($100, $50, $20 notes).',
        'Support pluggable cash dispensing strategies (e.g., Fewest Bills First vs Balanced Denomination Strategy).',
      ],
      requiresAbstraction: ['dispense strategy'],
    },
  ];

  for (const prob of problems) {
    const created = await prisma.problem.create({
      data: prob,
    });
    console.log(`Created problem: ${created.title} (${created.id})`);
  }

  console.log('Seeding completed successfully with 8 problems!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
