// ─────────────────────────────────────────────────────────────
// Beacon — scholarship database (single source of truth)
// Edit THIS file to add / change / remove scholarships. Both the
// website and the AI read from here, so you only update one place.
// Every entry must be a REAL program with a REAL official URL.
// ─────────────────────────────────────────────────────────────

export const CATS = {
  need: { label: "Need-based", tone: "blue" },
  merit: { label: "Merit", tone: "blue" },
  veterans: { label: "Veterans & military", tone: "green" },
  disability: { label: "Disability", tone: "violet" },
  stem: { label: "STEM", tone: "blue" },
  identity: { label: "Community", tone: "violet" },
  state: { label: "State grant", tone: "green" },
};

export const SCHOLARSHIPS = [
  // ── Essential first step ──
  { id: "pell", name: "Federal Pell Grant (FAFSA)", cat: "need", max: 7395, amt: "Up to $7,395 / yr", states: "all", gpa: null, level: "any", who: "Any US student with financial need — the doorway to most aid. File the FAFSA first.", url: "https://studentaid.gov/h/apply-for-aid/fafsa" },

  // ── Veterans & military families ──
  { id: "tillman", name: "Pat Tillman Foundation — Tillman Scholars", cat: "veterans", max: 10000, amt: "~$10,000 avg", states: "all", gpa: null, level: "college", who: "Veterans, active-duty service members, and military spouses.", url: "https://pattillmanfoundation.org/apply-to-be-a-tillman-scholar/" },
  { id: "folds", name: "Folds of Honor Scholarship", cat: "veterans", max: 5000, amt: "Up to $5,000 / yr", states: "all", gpa: null, level: "any", who: "Spouses and children of fallen or disabled service members.", url: "https://foldsofhonor.org/scholarships/" },
  { id: "mcsf", name: "Marine Corps Scholarship Foundation", cat: "veterans", max: 30000, amt: "$1,500 – $30,000", states: "all", gpa: null, level: "college", who: "Children of Marines and Navy Corpsmen.", url: "https://www.mcsf.org/" },
  { id: "amvets", name: "AMVETS National Scholarship", cat: "veterans", max: 4000, amt: "Up to $4,000", states: "all", gpa: null, level: "any", who: "Veterans and their children or grandchildren.", url: "https://amvets.org/scholarships/" },
  { id: "legion", name: "American Legion Legacy Scholarship", cat: "veterans", max: 20000, amt: "Varies (need-based)", states: "all", gpa: null, level: "college", who: "Children of post-9/11 fallen or disabled veterans.", url: "https://www.legion.org/scholarships" },
  { id: "vfw", name: "VFW Sport Clips Help A Hero Scholarship", cat: "veterans", max: 5000, amt: "Up to $5,000", states: "all", gpa: null, level: "college", who: "Service members and honorably discharged veterans.", url: "https://www.vfw.org/assistance/student-veterans-support" },
  { id: "aer", name: "Army Emergency Relief — MG James Ursano Scholarship", cat: "veterans", max: 8000, amt: "Varies (need-based)", states: "all", gpa: 2.0, level: "college", who: "Dependent children of active, retired, or deceased Army soldiers.", url: "https://www.armyemergencyrelief.org/scholarships/" },
  { id: "thanksusa", name: "ThanksUSA Scholarship", cat: "veterans", max: 3000, amt: "$3,000", states: "all", gpa: null, level: "college", who: "Children and spouses of active-duty military.", url: "https://www.thanksusa.org/scholarships.html" },
  { id: "fry", name: "Marine Gunnery Sgt. John David Fry Scholarship", cat: "veterans", max: 27000, amt: "Full tuition (GI Bill)", states: "all", gpa: null, level: "college", who: "Children/spouses of service members who died in the line of duty since 9/11.", url: "https://www.va.gov/education/survivor-dependent-benefits/fry-scholarship/" },
  { id: "milchild", name: "Scholarships for Military Children", cat: "veterans", max: 2000, amt: "$2,000", states: "all", gpa: null, level: "college", who: "Unmarried children of service members / retirees (commissary program).", url: "https://militaryscholar.org/" },

  // ── Students with disabilities ──
  { id: "msft-dis", name: "Microsoft Disability Scholarship", cat: "disability", max: 20000, amt: "Up to $5,000 / yr", states: "all", gpa: 3.0, level: "hs-senior", who: "High school seniors with a disability pursuing tech-related studies.", url: "https://www.microsoft.com/en-us/diversity/programs/microsoft-disability-scholarship" },
  { id: "google-lime", name: "Google Lime Connect Scholarship", cat: "disability", max: 10000, amt: "$10,000", states: "all", gpa: null, level: "college", who: "Students with a disability studying computer science or engineering.", url: "https://www.limeconnect.com/programs/page/google-lime-scholarship" },
  { id: "ncld", name: "Anne Ford Scholarship (NCLD)", cat: "disability", max: 10000, amt: "$10,000", states: "all", gpa: null, level: "hs-senior", who: "Students with a documented learning disability or ADHD.", url: "https://www.ncld.org/anne-ford-scholarship/" },
  { id: "chair", name: "ChairScholars Foundation Scholarship", cat: "disability", max: 5000, amt: "Up to $5,000", states: "all", gpa: 3.0, level: "college", who: "Students with a significant physical disability and financial need.", url: "https://chairscholars.org/" },
  { id: "nfb", name: "National Federation of the Blind Scholarships", cat: "disability", max: 12000, amt: "$3,000 – $12,000", states: "all", gpa: null, level: "college", who: "Legally blind students at any level of study.", url: "https://nfb.org/programs-services/scholarships-and-awards/scholarship-program" },
  { id: "aahd", name: "AAHD Frederick J. Krause Scholarship", cat: "disability", max: 1000, amt: "$1,000", states: "all", gpa: 3.0, level: "college", who: "Students with a documented disability, health-related focus preferred.", url: "https://www.aahd.us/initiatives/scholarship-program/" },
  { id: "180med", name: "180 Medical College Scholarship", cat: "disability", max: 1000, amt: "$1,000", states: "all", gpa: null, level: "college", who: "Students living with spina bifida, spinal-cord injury, or related conditions.", url: "https://www.180medical.com/scholarship/" },
  { id: "rockcf", name: "Rock CF Lauren Melissa Kelly Scholarship", cat: "disability", max: 2500, amt: "Up to $2,500", states: "all", gpa: null, level: "college", who: "Students living with cystic fibrosis.", url: "https://letsrockcf.org/programs/scholarship/" },

  // ── General merit & need (open to nearly everyone) ──
  { id: "gates", name: "The Gates Scholarship", cat: "need", max: 70000, amt: "Full cost of attendance", states: "all", gpa: 3.3, level: "hs-senior", who: "High-achieving, Pell-eligible minority high school seniors.", url: "https://www.thegatesscholarship.org/scholarship" },
  { id: "jkcf", name: "Jack Kent Cooke College Scholarship", cat: "need", max: 55000, amt: "Up to $55,000 / yr", states: "all", gpa: 3.5, level: "hs-senior", who: "High-achieving students with significant financial need.", url: "https://www.jkcf.org/our-scholarships/college-scholarship-program/" },
  { id: "questbridge", name: "QuestBridge National College Match", cat: "need", max: 70000, amt: "Full 4-year scholarship", states: "all", gpa: null, level: "hs-senior", who: "High-achieving students from low-income households.", url: "https://www.questbridge.org/high-school-students/national-college-match" },
  { id: "coke", name: "Coca-Cola Scholars Program", cat: "merit", max: 20000, amt: "$20,000", states: "all", gpa: 3.0, level: "hs-senior", who: "High school seniors with strong leadership and service.", url: "https://www.coca-colascholarsfoundation.org/apply/" },
  { id: "dell", name: "Dell Scholars Program", cat: "need", max: 20000, amt: "$20,000 + support", states: "all", gpa: 2.4, level: "hs-senior", who: "Students who show grit and financial need (often in college-readiness programs).", url: "https://www.dellscholars.org/scholarship/" },
  { id: "horatio", name: "Horatio Alger National Scholarship", cat: "need", max: 25000, amt: "$25,000", states: "all", gpa: null, level: "hs-senior", who: "Students who overcame adversity and have critical financial need.", url: "https://scholars.horatioalger.org/scholarships/" },
  { id: "elks", name: "Elks Most Valuable Student Scholarship", cat: "merit", max: 50000, amt: "$4,000 – $50,000", states: "all", gpa: null, level: "hs-senior", who: "High school seniors judged on scholarship, leadership, and need.", url: "https://www.elks.org/scholars/scholarships/mvs.cfm" },
  { id: "cameron", name: "Bryan Cameron Impact Scholarship", cat: "merit", max: 40000, amt: "Up to $10,000 / yr", states: "all", gpa: 3.7, level: "hs-senior", who: "High school seniors with exceptional drive and service.", url: "https://www.bryancameroneducationfoundation.org/" },
  { id: "davidson", name: "Davidson Fellows Scholarship", cat: "merit", max: 50000, amt: "$10,000 – $50,000", states: "all", gpa: null, level: "any", who: "Students under 18 with a significant project in STEM, literature, or music.", url: "https://www.davidsongifted.org/gifted-programs/fellows-scholarship/" },
  { id: "bk", name: "Burger King Scholars", cat: "merit", max: 60000, amt: "$1,000 – $60,000", states: "all", gpa: 2.5, level: "hs-senior", who: "High school seniors across the US; part-time employees may also apply.", url: "https://bkmclamorefoundation.org/who-we-are/our-programs" },

  // ── STEM & fields ──
  { id: "smart", name: "SMART Scholarship (Dept. of Defense)", cat: "stem", max: 60000, amt: "Full tuition + stipend", states: "all", gpa: 3.0, level: "college", who: "STEM students willing to work for the DoD after graduation.", url: "https://www.smartscholarship.org/smart" },
  { id: "swe", name: "Society of Women Engineers Scholarships", cat: "stem", max: 16000, amt: "$1,000 – $16,000", states: "all", gpa: null, level: "college", who: "Women pursuing engineering, computing, or engineering technology.", url: "https://swe.org/scholarships/" },
  { id: "gen-google", name: "Generation Google Scholarship", cat: "stem", max: 10000, amt: "$10,000", states: "all", gpa: null, level: "college", who: "Computer science students from historically excluded groups.", url: "https://buildyourfuture.withgoogle.com/scholarships/generation-google-scholarship" },

  // ── Identity & community ──
  { id: "hsf", name: "Hispanic Scholarship Fund", cat: "identity", max: 5000, amt: "$500 – $5,000", states: "all", gpa: 3.0, level: "any", who: "Students of Hispanic heritage at any accredited US school.", url: "https://www.hsf.net/scholarship" },
  { id: "uncf", name: "UNCF General Scholarship", cat: "identity", max: 10000, amt: "Varies", states: "all", gpa: 2.5, level: "college", who: "African American students and those attending UNCF member schools.", url: "https://scholarships.uncf.org/" },
  { id: "apia", name: "APIA Scholarship", cat: "identity", max: 20000, amt: "$2,500 – $20,000", states: "all", gpa: null, level: "college", who: "Asian & Pacific Islander American students, need-based.", url: "https://apiascholars.org/scholarship/apia-scholarship/" },
  { id: "aicf", name: "American Indian College Fund", cat: "identity", max: 10000, amt: "Varies", states: "all", gpa: 2.0, level: "college", who: "Native American and Alaska Native students.", url: "https://collegefund.org/students/scholarships/" },
  { id: "ronbrown", name: "Ron Brown Scholar Program", cat: "identity", max: 40000, amt: "$10,000 / yr for 4 yrs", states: "all", gpa: null, level: "hs-senior", who: "Black/African American high school seniors with leadership.", url: "https://www.ronbrown.org/" },
  { id: "point", name: "Point Foundation Scholarship", cat: "identity", max: 10000, amt: "Varies", states: "all", gpa: null, level: "college", who: "LGBTQ students demonstrating leadership.", url: "https://pointfoundation.org/point-apply/point-scholarship/" },

  // ── State grants ──
  { id: "calgrant", name: "Cal Grant (California)", cat: "state", max: 14000, amt: "Up to ~$14,000", states: "CA", gpa: 2.0, level: "any", who: "California residents with financial need. File the FAFSA + CA GPA verification.", url: "https://www.csac.ca.gov/cal-grants" },
  { id: "bright", name: "Florida Bright Futures", cat: "state", max: 6000, amt: "Tuition coverage", states: "FL", gpa: 3.0, level: "hs-senior", who: "Florida residents meeting GPA, test, and service-hour benchmarks.", url: "https://www.floridastudentfinancialaidsg.org/SAPBFMAIN/SAPBFMAIN" },
  { id: "hope", name: "Georgia HOPE Scholarship", cat: "state", max: 7000, amt: "Tuition award", states: "GA", gpa: 3.0, level: "any", who: "Georgia residents with a 3.0+ GPA at eligible schools.", url: "https://www.gafutures.org/hope-state-aid-programs/" },
  { id: "nytap", name: "New York TAP", cat: "state", max: 5665, amt: "Up to $5,665", states: "NY", gpa: null, level: "any", who: "New York residents attending in-state colleges, need-based.", url: "https://www.hesc.ny.gov/pay-for-college/apply-for-financial-aid/nys-tap.html" },
  { id: "txgrant", name: "TEXAS Grant", cat: "state", max: 5000, amt: "Varies (tuition/fees)", states: "TX", gpa: null, level: "college", who: "Texas residents with financial need at public institutions.", url: "https://www.collegeforalltexans.com/" },
  { id: "tnpromise", name: "Tennessee Promise", cat: "state", max: 4000, amt: "Free community/technical college", states: "TN", gpa: null, level: "hs-senior", who: "Tennessee high school graduates (last-dollar scholarship + mentoring).", url: "https://tnpromise.gov/" },
  { id: "wacg", name: "Washington College Grant", cat: "state", max: 12000, amt: "Varies (up to full tuition)", states: "WA", gpa: null, level: "any", who: "Washington residents with income under program limits.", url: "https://wsac.wa.gov/wcg" },
];

// Compact one-line-per-scholarship view used to ground the AI.
export function promptList() {
  return SCHOLARSHIPS.map(
    (s) => `${s.id} | ${s.name} | ${CATS[s.cat].label} | max $${s.max} | states:${s.states} | gpa:${s.gpa || "none"} | level:${s.level} | ${s.who}`
  ).join("\n");
}
