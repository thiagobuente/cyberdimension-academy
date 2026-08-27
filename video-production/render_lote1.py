from __future__ import annotations

import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path('/home/ubuntu/cyberdimension-academy/video-production')
OUT = Path('/home/ubuntu/webdev-static-assets/cyberdimension-lote1')
OUT.mkdir(parents=True, exist_ok=True)
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FONT_BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
W, H = 1920, 1080

LESSONS = {
    '02': {
        'title': 'Conceito essencial: Ferramentas de Inteligência Artificial',
        'audio': ROOT / 'aula-02-narracao-ptbr.wav',
        'slides': [
            ('AULA 02', 'Ferramentas de Inteligência Artificial', 'Escolher a ferramenta certa começa por entender o objetivo.'),
            ('MODELO ≠ FERRAMENTA', 'O modelo produz; a ferramenta organiza a experiência.', 'Conversa • pesquisa • documentos • automação'),
            ('MAPA DE POSSIBILIDADES', 'Texto, pesquisa, imagem, áudio, vídeo e programação.', 'Cada modalidade tem limites, licenças e riscos próprios.'),
            ('COMO ESCOLHER', 'Objetivo → dados → privacidade → formato → revisão.', 'A ferramenta adequada é a que atende ao contexto com menor risco.'),
            ('VERIFIQUE SEMPRE', 'Respostas podem conter erros, vieses ou referências inexistentes.', 'Compare com documentação primária e teste em ambiente controlado.'),
            ('PRIVACIDADE E RESPONSABILIDADE', 'Nunca envie senhas, tokens, chaves privadas ou dados de clientes.', 'Prefira exemplos sintéticos e menor privilégio.'),
            ('DESAFIO PRÁTICO', 'Compare duas ferramentas para uma tarefa de cibersegurança.', 'Registre o prompt, fontes, erros encontrados e decisão final.'),
        ],
    },
    '03': {
        'title': 'Demonstração segura: Engenharia de Prompts',
        'audio': ROOT / 'aula-03-narracao-ptbr.wav',
        'slides': [
            ('AULA 03', 'Demonstração segura: Engenharia de Prompts', 'Instruções claras produzem respostas mais fáceis de avaliar.'),
            ('O QUE É UM PROMPT?', 'Uma especificação para orientar uma ferramenta de IA.', 'Contexto • objetivo • papel • restrições • formato'),
            ('PROMPT RUIM', '“Explique segurança de rede.”', 'Sem público, escopo, ambiente, formato ou critério de qualidade.'),
            ('PROMPT MELHORADO', '“Explique segurança de rede para iniciantes com exemplos.”', 'Já há público e estrutura, mas ainda falta contexto operacional.'),
            ('PROMPT PROFISSIONAL', 'Defina objetivo, ambiente, limites, formato e incertezas.', 'Inclua laboratório autorizado e proíba comandos destrutivos.'),
            ('REFINAMENTO', 'Observar → identificar lacuna → acrescentar contexto → revisar.', 'Prompts precisos não precisam ser longos; precisam ser avaliáveis.'),
            ('DESAFIO FINAL', 'Transforme “analise este sistema” em uma solicitação profissional.', 'Declare escopo, autorização, riscos, formato e perguntas em aberto.'),
        ],
    },
}


def font(size: int, bold: bool = False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT, size)


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt, max_width: int):
    words = text.split()
    lines, current = [], ''
    for word in words:
        candidate = f'{current} {word}'.strip()
        if draw.textbbox((0, 0), candidate, font=fnt)[2] <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def make_slide(label: str, title: str, subtitle: str, path: Path):
    img = Image.new('RGB', (W, H), '#050914')
    draw = ImageDraw.Draw(img)
    # spatial grid and restrained glow-like bands
    for x in range(0, W, 120):
        draw.line((x, 0, x, H), fill='#0b1726', width=2)
    for y in range(0, H, 120):
        draw.line((0, y, W, y), fill='#0b1726', width=2)
    draw.rectangle((0, 0, W, 12), fill='#06d9e8')
    draw.ellipse((1420, -260, 2050, 370), fill='#071e35', outline='#0d5364', width=4)
    draw.ellipse((1490, -190, 1980, 300), outline='#0c7180', width=3)
    draw.ellipse((1570, -120, 1910, 220), outline='#12d9df', width=2)
    draw.text((120, 100), 'CYBERDIMENSION ACADEMY', font=font(30, True), fill='#67f4f0')
    draw.text((120, 154), label, font=font(30, True), fill='#8d9caf')
    title_font = font(78, True)
    lines = wrap(draw, title, title_font, 1250)
    y = 310
    for line in lines:
        draw.text((120, y), line, font=title_font, fill='#f4f8ff')
        y += 98
    sub_font = font(36)
    sub_lines = wrap(draw, subtitle, sub_font, 1120)
    y += 35
    for line in sub_lines:
        draw.text((120, y), line, font=sub_font, fill='#aab8ca')
        y += 55
    # visual teaching motif: nodes connected to a central objective
    cx, cy = 1510, 650
    draw.ellipse((cx-110, cy-110, cx+110, cy+110), fill='#0a3440', outline='#14e2df', width=5)
    draw.text((cx-67, cy-25), 'IA', font=font(50, True), fill='#efffff')
    nodes = [(1280, 470, 'OBJETIVO'), (1740, 470, 'DADOS'), (1280, 830, 'RISCO'), (1740, 830, 'REVISÃO')]
    for nx, ny, txt in nodes:
        draw.line((cx, cy, nx, ny), fill='#1e7180', width=4)
        draw.ellipse((nx-95, ny-40, nx+95, ny+40), fill='#071d2b', outline='#16bfc8', width=3)
        tw = draw.textbbox((0, 0), txt, font=font(20, True))[2]
        draw.text((nx-tw/2, ny-13), txt, font=font(20, True), fill='#b8ffff')
    draw.text((120, 940), 'Aprender  →  Praticar  →  Verificar', font=font(28, True), fill='#16d9df')
    img.save(path, quality=95)


def duration(path: Path) -> float:
    out = subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', str(path)], text=True)
    return float(out.strip())


def render(code: str, lesson: dict):
    lesson_dir = OUT / f'aula-{code}'
    lesson_dir.mkdir(parents=True, exist_ok=True)
    slides = []
    for idx, (label, title, subtitle) in enumerate(lesson['slides'], 1):
        p = lesson_dir / f'scene-{idx:02d}.png'
        make_slide(label, title, subtitle, p)
        slides.append(p)
    total = duration(lesson['audio'])
    per_scene = total / len(slides)
    concat = lesson_dir / 'slides.txt'
    concat.write_text(''.join(f"file '{p}'\nduration {per_scene:.6f}\n" for p in slides) + f"file '{slides[-1]}'\n", encoding='utf-8')
    silent = lesson_dir / 'slides-video.mp4'
    final = OUT / f'cyberdimension-aula-{code}.mp4'
    subprocess.run(['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', str(concat), '-vf', 'format=yuv420p', '-r', '30', '-c:v', 'libx264', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(silent)], check=True)
    subprocess.run(['ffmpeg', '-y', '-i', str(silent), '-i', str(lesson['audio']), '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', str(final)], check=True)
    metadata = OUT / f'aula-{code}-chapters.txt'
    lines = [';FFMETADATA1']
    for idx, (_, title, _) in enumerate(lesson['slides']):
        start = int(round(idx * total / len(lesson['slides']) * 1000))
        end = int(round((idx + 1) * total / len(lesson['slides']) * 1000))
        lines += [f'[CHAPTER]', 'TIMEBASE=1/1000', f'START={start}', f'END={end}', f'title={title}']
    metadata.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    chaptered = OUT / f'cyberdimension-aula-{code}-chaptered.mp4'
    subprocess.run(['ffmpeg', '-y', '-i', str(final), '-i', str(metadata), '-map', '0', '-map_metadata', '1', '-c', 'copy', str(chaptered)], check=True)
    chaptered.replace(final)
    print(f'Aula {code}: duration={total:.2f}s scenes={len(slides)} file={final} bytes={final.stat().st_size}')


if __name__ == '__main__':
    for code, lesson in LESSONS.items():
        render(code, lesson)
