# Validação visual — superfícies, contraste e tema

Em 14 de agosto de 2026, a área de estudo foi revisada em desktop e em viewport móvel de 390 × 844 px. O simulado mantém cartões, texto, barra de controles e ação principal legíveis nas duas larguras. A trilha semanal preserva a hierarquia dos cartões, metas e ações sem colapso visual no layout móvel.

No simulado, o tema claro foi exercitado com a preferência **Contraste alto** ativa. Títulos, descrições, superfícies de orientação e a barra de leitura permaneceram com contraste suficiente; o cabeçalho escuro conservou texto claro localmente. A preferência persistente alterou o rótulo do controle para **Contraste alto**, confirmando a aplicação do estado acessível.

A alternância foi exercitada do tema claro para o escuro e de volta ao claro, mantendo o contraste elevado ativo. As duas direções preservaram a legibilidade do título, dos cartões, dos controles e da ação principal durante a mudança de superfície.

A animação de tema é limitada às propriedades `background-color`, `color`, `border-color`, `box-shadow` e `opacity`, com duração curta e condicionada a `prefers-reduced-motion: no-preference`.
