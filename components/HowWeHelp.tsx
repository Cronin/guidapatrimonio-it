const services = [
  {
    number: '01',
    title: 'Compila il Form',
    description: 'Inserisci i tuoi dati e il capitale che vorresti investire. Bastano 2 minuti per iniziare il processo.',
  },
  {
    number: '02',
    title: 'Verifica Profilo',
    description: 'Analizziamo la tua richiesta per verificare la compatibilita con le soluzioni del nostro partner svizzero.',
  },
  {
    number: '03',
    title: 'Callback Gratuito',
    description: 'Se il tuo profilo e idoneo (patrimonio >= 150K), verrai ricontattato da un consulente del nostro partner.',
  },
  {
    number: '04',
    title: 'Strategia Personalizzata',
    description: 'Ricevi una proposta di investimento su misura basata sui tuoi obiettivi: rendita, crescita o protezione.',
  },
]

export default function HowWeHelp() {
  return (
    <section id="come-lavoriamo" className="section-lg bg-navy text-white">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-gold text-sm font-medium tracking-wider uppercase mb-4">Come Funziona</p>
          <h2 className="font-heading text-h3-sm md:text-h3 text-white mb-6">
            4 passi per iniziare
          </h2>
          <p className="text-body-lg text-white/80">
            Un processo semplice e trasparente per metterti in contatto
            con i nostri partner esperti in gestione patrimoniale.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex gap-6 p-8 rounded-card bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <span className="font-heading text-h4-lg text-gold opacity-70">
                {service.number}
              </span>
              <div>
                <h3 className="font-body text-h4 text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-body-md text-white/70">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
